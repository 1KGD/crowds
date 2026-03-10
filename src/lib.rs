extern crate console_error_panic_hook;
extern crate noise;
extern crate rand;
extern crate wasm_bindgen;

mod creatures;
mod game;
mod tiles;
mod util;
pub use crate::game::*;

use std::panic;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}
