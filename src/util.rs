use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Vec2 {
    pub x: i32,
    pub y: i32,
}

impl Vec2 {
    pub fn x_f32(&self) -> f32 {
        self.x as f32
    }

    pub fn y_f32(&self) -> f32 {
        self.y as f32
    }
}

#[wasm_bindgen]
pub fn vec2(x: i32, y: i32) -> Vec2 {
    Vec2 { x, y }
}
