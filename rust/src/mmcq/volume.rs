use super::color::Color;

use std::collections::HashMap;

#[derive(Copy, Clone, Debug)]
pub struct Pixel {
  pub color: Color,
  pub count: u32,
}

pub struct Volume {
  pub pixels: HashMap<u32, Pixel>,
  pub size: u32,
}

impl Volume {
  pub fn from_colors(colors: &[Color], algorithm: u8) -> Volume {
    let mut volume = Volume {
      pixels: HashMap::new(),
      size: 0,
    };

    for color in colors {
      let idx = color.compose(algorithm);

      match volume.pixels.get_mut(&idx) {
        Some(x) => x.count += 1,
        None => {
          volume.pixels.insert(
            idx,
            Pixel {
              color: *color,
              count: 1,
            },
          );
        }
      }

      volume.size += 1;
    }

    volume
  }

  pub fn get_main_color(&self) -> [f64; 3] {
    let mut avg = [0.0, 0.0, 0.0];

    if self.size == 0 {
      return avg;
    }

    for pixel in self.pixels.values() {
      for i in 0..=2 {
        avg[i] += pixel.color.get(i) as f64 * pixel.count as f64;
      }
    }

    for i in 0..=2 {
      avg[i] = avg[i] / self.size as f64;
    }

    avg
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

      let next = if pixel.color.get(dimension) as f64 > middle {
        &mut right
      } else {
        &mut left
      };

      next.size += pixel.count;

      match next.pixels.get_mut(&idx) {
        Some(x) => x.count += pixel.count,
        None => {
          next.pixels.insert(idx, pixel);
        }
      };
    }

    (left, right)
  }
}

fn get_max_dimension(volume: &Volume) -> (usize, f64) {
  if volume.pixels.len() == 0 {
    return (0, 0.0);
  }

  let mut max: [u8; 3] = [0; 3];
  let mut min: [u8; 3] = [0xff; 3];

  for pixel in volume.pixels.values() {
    for idx in 0..=2 {
      let color_value = pixel.color.get(idx);
      max[idx] = color_value.max(max[idx]);
      min[idx] = color_value.min(min[idx]);
    }
  }

  let r = max[0] - min[0];
  let g = max[1] - min[1];
  let b = max[2] - min[2];

  let dimension = if r >= g && r >= b {
    0
  } else if g >= r && g >= b {
    1
  } else {
    2
  };

  let mid = (max[dimension] as f64 + min[dimension] as f64) / 2.0;

  (dimension, mid)
}
