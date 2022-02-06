use super::color::Color;

use std::cmp;
use std::collections::HashMap;

#[derive(Copy, Clone)]
pub struct Pixel {
  pub color: Color,
  pub count: u32,
}

pub struct Volume {
  pub pixels: HashMap<u32, Pixel>,
  pub size: u32,
}

impl Volume {
  pub fn get_main_color(&self) -> Color {
    let mut r: u32 = 0;
    let mut g: u32 = 0;
    let mut b: u32 = 0;

    for pixel in self.pixels.values() {
      r = r + pixel.color.r() as u32 * pixel.count;
      g = g + pixel.color.g() as u32 * pixel.count;
      b = b + pixel.color.g() as u32 * pixel.count;
    }

    let r = (r / self.size) as u8;
    let g = (g / self.size) as u8;
    let b = (b / self.size) as u8;

    return Color::new(r, g, b);
  }

  pub fn split(&self) -> (Volume, Volume) {
    let mut left = Volume {
      pixels: HashMap::new(),
      size: 0,
    };

    let mut right = Volume {
      pixels: HashMap::new(),
      size: 0,
    };

    let (dimension, middle) = get_max_dimension(self);

    for &pixel in self.pixels.values() {
      if pixel.color.get(dimension as usize) > middle {
        right.size = right.size + pixel.count;
        right.pixels.insert(pixel.color.compose_default(), pixel);
      } else {
        left.size += pixel.count;
        left.pixels.insert(pixel.color.compose_default(), pixel);
      }
    }

    (left, right)
  }
}

fn get_max_dimension(volume: &Volume) -> (u8, u8) {
  let mut max: [u8; 3] = [0; 3];
  let mut min: [u8; 3] = [0xff; 3];

  for pixel in volume.pixels.values() {
    max[0] = cmp::max(pixel.color.r(), max[0]);
    max[1] = cmp::max(pixel.color.g(), max[1]);
    max[2] = cmp::max(pixel.color.b(), max[2]);
    // --
    min[0] = cmp::min(pixel.color.r(), min[0]);
    min[1] = cmp::min(pixel.color.g(), min[1]);
    min[2] = cmp::min(pixel.color.b(), min[2]);
  }

  let r = max[0] - min[0];
  let g = max[1] - min[1];
  let b = max[2] - min[2];

  let dimension: u8 = if r >= g && r >= b {
    0
  } else if g >= r && g >= b {
    1
  } else {
    2
  };

  let mid = (max[dimension as usize] - min[dimension as usize]) / 2;

  (dimension, mid)
}
