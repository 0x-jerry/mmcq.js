#[derive(Copy, Clone, Debug)]
pub struct Color {
  data: [u8; 3],
}

pub const COLOR_BIT: u8 = 8;

impl Color {
  pub fn new(r: u8, g: u8, b: u8) -> Color {
    Color { data: [r, g, b] }
  }

  pub fn r(&self) -> u8 {
    return self.data[0];
  }

  pub fn g(&self) -> u8 {
    return self.data[1];
  }

  pub fn b(&self) -> u8 {
    return self.data[2];
  }

  pub fn get(&self, idx: usize) -> u8 {
    self.data[idx]
  }

  pub fn compose(&self, bit: u8) -> u32 {
    let shift_bit = COLOR_BIT - bit;

    let r: u32 = (self.r() >> shift_bit) as u32;
    let g: u32 = (self.g() >> shift_bit) as u32;
    let b: u32 = (self.b() >> shift_bit) as u32;

    return (r << (2 * bit)) + (g << (1 * bit)) + b;
  }

  pub fn delta(&self, color: &Color) -> i32 {
    let r = (color.r() as i32 - self.r() as i32).pow(2);
    let g = (color.g() as i32 - self.g() as i32).pow(2);
    let b = (color.b() as i32 - self.b() as i32).pow(2);

    return r + g + b;
  }

  pub fn delta_arr(&self, color: &[f32; 3]) -> f32 {
    let mut delta: f32 = 0.0;

    for i in 0..3 {
      delta += (self.get(i) as f32 - color[i]).powf(2.0)
    }

    delta
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_color() {
    let c: Color = Color::new(1, 2, 3);
    assert_eq!(c.r(), 1);
    assert_eq!(c.g(), 2);
    assert_eq!(c.b(), 3);
    assert_eq!(c.compose(5), 1091);
  }
}
