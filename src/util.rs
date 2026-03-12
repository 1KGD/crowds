use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
pub struct Vec2 {
    pub x: f32,
    pub y: f32,
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct TileVec2 {
    pub x: i32,
    pub y: i32,
}

impl TileVec2 {
    pub fn x_f32(&self) -> f32 {
        self.x as f32
    }

    pub fn y_f32(&self) -> f32 {
        self.y as f32
    }

    pub fn to_index(&self, width: u32) -> usize {
        self.x as usize + self.y as usize * width as usize
    }
}

pub fn tile_vec2(x: i32, y: i32) -> TileVec2 {
    TileVec2 { x, y }
}

pub fn vec2(x: f32, y: f32) -> Vec2 {
    Vec2 { x, y }
}
