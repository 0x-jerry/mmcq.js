use super::color::Color;
use crate::log;

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
  pub fn from_colors(colors: &[u8], algorithm: u8) -> Volume {
    let mut volume = Volume {
      pixels: HashMap::new(),
      size: 0,
    };

    let mut i = 0;

    while i + 4 < colors.len() {
      let r = colors[i];
      let g = colors[i + 1];
      let b = colors[i + 2];

      let pixel = Pixel {
        color: Color::new(r, g, b),
        count: 1,
      };

      volume.pixels.insert(pixel.color.compose(algorithm), pixel);
      i += 4;
    }

    volume.size = volume.pixels.len() as u32;

    volume
  }

  pub fn get_main_color(&self) -> Color {
    if self.size == 0 {
      return Color::new(0, 0, 0);
    }

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

  pub fn split(&self, bit: u8) -> (Volume, Volume) {
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
      let idx = pixel.color.compose(bit);

      if pixel.color.get(dimension as usize) > middle {
        right.size += pixel.count;

        match right.pixels.get_mut(&idx) {
          Some(x) => x.count += pixel.count,
          None => {
            right.pixels.insert(idx, pixel);
          }
        };
      } else {
        left.size += pixel.count;

        match left.pixels.get_mut(&idx) {
          Some(x) => x.count += pixel.count,
          None => {
            left.pixels.insert(idx, pixel);
          }
        };
      }
    }

    (left, right)
  }
}

fn get_max_dimension(volume: &Volume) -> (u8, u8) {
  if volume.pixels.len() == 0 {
    return (0, 0);
  }

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

  log(&format!("{:?}, {:?}", max, min));

  let r = max[0] - min[0];
  let g = max[1] - min[1];
  let b = max[2] - min[2];

  log(&format!("{:?}, {:?}, {}", r, g, b));

  let dimension: u8 = if r >= g && r >= b {
    0
  } else if g >= r && g >= b {
    1
  } else {
    2
  };

  log(&"4");

  let mid = (max[dimension as usize] - min[dimension as usize]) / 2;

  (dimension, mid)
}
