use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;

mod mmcq;

#[wasm_bindgen]
extern "C" {
  // Use `js_namespace` here to bind `console.log(..)` instead of just
  // `log(..)`
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

#[wasm_bindgen]
pub fn mmcq(colors: Clamped<Vec<u8>>, color_count: u8, algorithm: u8) -> JsValue {
  let colors = get_colors_from_bytes(&colors);
  let main_colors = mmcq::get_palette(&colors, color_count, algorithm);

  log(&format!("{:?}", &main_colors));

  let mut export_colors = vec![];

  for color in main_colors {
    export_colors.push(color.compose(8))
  }

  JsValue::from_serde(&export_colors).unwrap()
}

fn get_colors_from_bytes(bytes: &[u8]) -> Vec<mmcq::Color> {
  let mut colors = vec![];

  let mut i = 0;
  let max_len = bytes.len();

  while i + 4 < max_len {
    let r = bytes[i];
    let g = bytes[i + 1];
    let b = bytes[i + 2];

    colors.push(mmcq::Color::new(r, g, b));

    i += 4;
  }

  colors
}
