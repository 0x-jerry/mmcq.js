mod color;
mod volume;

use std::cmp;
use std::collections::HashMap;

pub use color::Color;
pub use volume::Pixel;
pub use volume::Volume;

pub fn get_palette(colors: &[u8], colorCount: u8) {
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

  let mut colors: Vec<Color> = vec![];

  let mut volumes: Vec<Volume> = vec![];

  volumes.push(volume);

  let mut size = volumes.len();

  while size < colorCount as usize {
    for item in volumes.iter() {
      let (left, right) = item.split();
    }
  }
}
