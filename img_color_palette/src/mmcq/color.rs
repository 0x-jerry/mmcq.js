#[derive(Copy, Clone)]
pub struct Color {
  data: [u8; 3],
}

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

  pub fn compose_default(&self) -> u32 {
    return self.compose(5);
  }

  pub fn compose(&self, bit: u8) -> u32 {
    let r: u32 = self.r() as u32;
    let g: u32 = self.g() as u32;
    let b: u32 = self.b() as u32;

    return (r << 2 * bit) + (g << 1 * bit) + b;
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
    assert_eq!(c.compose_default(), 1091);
  }
}
