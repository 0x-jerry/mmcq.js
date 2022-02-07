use wasm_bindgen::prelude::*;
use wasm_bindgen::Clamped;

mod mmcq;

#[wasm_bindgen]
extern "C" {
  // Use `js_namespace` here to bind `console.log(..)` instead of just
  // `log(..)`
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);

  // The `console.log` is quite polymorphic, so we can bind it with multiple
  // signatures. Note that we need to use `js_name` to ensure we always call
  // `log` in JS.
  #[wasm_bindgen(js_namespace = console, js_name = log)]
  fn log_u32(a: u32);

  // Multiple arguments too!
  #[wasm_bindgen(js_namespace = console, js_name = log)]
  fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn mmcq(colors: Clamped<Vec<u8>>, color_count: u8, algorithm: u8) -> JsValue {
  let main_colors = mmcq::get_palette(&colors, color_count, algorithm);

  log(&format!("{:?}", &main_colors));

  let mut export_colors = vec![];

  for color in main_colors {
    export_colors.push(color.compose(8))
  }

  JsValue::from_serde(&export_colors).unwrap()
}
