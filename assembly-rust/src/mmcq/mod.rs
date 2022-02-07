mod color;
mod volume;

use crate::log;

pub use color::Color;
pub use volume::Pixel;
pub use volume::Volume;

pub fn get_palette(colors: &[Color], color_count: u8, algorithm: u8) -> Vec<Color> {
  let mut volumes = vec![];

  let volume = Volume::from_colors(colors, algorithm);
  volumes.push(volume);

  while volumes.len() < color_count as usize {
    let mut new_volumes = vec![];

    for volume in &volumes {
      let (left, right) = volume.split(algorithm);

      if left.size > 0 {
        new_volumes.push(left);
      }

      if right.size > 0 {
        new_volumes.push(right);
      }
    }

    let len = volumes.len();

    if new_volumes.len() == len {
      break;
    }

    volumes = new_volumes;
    volumes.sort_by(|a, b| b.size.cmp(&a.size));
  }

  let mut main_colors = vec![];

  for volume in volumes {
    log(&format!("size: {}", volume.size));

    if main_colors.len() < color_count as usize {
      main_colors.push(volume.get_main_color());
    }
  }

  main_colors
}
