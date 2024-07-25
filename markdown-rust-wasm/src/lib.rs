mod utils;

use markdown;
use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub fn to_mdast(markdown: &str) -> Result<(), markdown::message::Message> {
//     markdown::to_mdast(markdown, &markdown::ParseOptions::default())
// }

#[wasm_bindgen]
pub fn to_string(markdown: &str) -> String {
    markdown::to_html(markdown)
}