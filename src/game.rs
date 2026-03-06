use noise_perlin::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Vec2 {
    x: i32,
    y: i32,
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

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Tile {
    Air = 0,
    Stone = 1,
}

#[wasm_bindgen]
pub struct World {
    shape: Vec2,
    tiles: Vec<Tile>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> World {
        let shape: Vec2 = vec2(width as i32, height as i32);
        let size: u32 = width * height;

        let tiles = (0..size)
            .map(|i: u32| {
                Self::gen_tile_at_pos(vec2((i % width) as i32, (i / width) as i32), shape)
            })
            .collect();

        World { shape, tiles }
    }

    fn gen_tile_at_pos(pos: Vec2, shape: Vec2) -> Tile {
        if perlin_2d(
            pos.x_f32() / shape.x_f32() * 6.,
            pos.y_f32() / shape.y_f32() * 6.,
        ) >= 0.
        {
            return Tile::Air;
        }
        Tile::Stone
    }

    #[wasm_bindgen(js_name = tilesPtr, getter)]
    pub fn tiles_ptr(&self) -> *const Tile {
        self.tiles.as_ptr()
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> u32 {
        self.shape.x as u32
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.shape.y as u32
    }
}
