mod color;
mod volume;

use crate::log;

pub use color::Color;
pub use volume::Pixel;
pub use volume::Volume;

pub fn get_palette(colors: &[u8], color_count: u8, algorithm: u8) -> Vec<Color> {
  let volume = Volume::from_colors(colors, algorithm);

  let mut volumes: Vec<Volume> = vec![];

  volumes.push(volume);

  let mut size = volumes.len();

  while size < color_count as usize {
    let mut new_volume = vec![];

    for item in volumes.iter() {
      log(&format!("volumes size: {}", item.size));

      let (left, right) = item.split(algorithm);

      new_volume.push(left);
      new_volume.push(right);
    }

    volumes = new_volume;

    size = volumes.len();
  }

  let mut main_colors = vec![];

  for volume in volumes {
    if main_colors.len() < color_count as usize {
      main_colors.push(volume.get_main_color());
    }
  }

  main_colors
}
