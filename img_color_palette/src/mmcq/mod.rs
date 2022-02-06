mod color;
mod volume;

use std::collections::HashMap;

pub use color::Color;
pub use volume::Pixel;
pub use volume::Volume;

pub fn get_palette(colors: &[u8], color_count: u8) -> Vec<Color> {
  let mut i = 0;

  let mut volume = Volume {
    pixels: HashMap::new(),
    size: 0,
  };

  while i + 4 < colors.len() {
    let r = colors[i];
    let g = colors[i + 1];
    let b = colors[i + 2];

    let pixel = Pixel {
      color: Color::new(r, g, b),
      count: 1,
    };

    volume.pixels.insert(0, pixel);

    i += 4;
  }

  volume.size = colors.len() as u32;

  let mut volumes: Vec<Volume> = vec![];

  volumes.push(volume);

  let mut size = volumes.len();

  while size < color_count as usize {
    let mut new_volume = vec![];

    for item in volumes.iter() {
      let (left, right) = item.split();
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
