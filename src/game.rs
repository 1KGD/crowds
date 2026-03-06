use noise_perlin::*;
use std::fmt;
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

    pub fn gen_tile_at_pos(pos: Vec2, shape: Vec2) -> Tile {
        if perlin_2d(
            pos.x_f32() / shape.x_f32() * 6.,
            pos.y_f32() / shape.y_f32() * 6.,
        ) >= 0.
        {
            return Tile::Air;
        }
        Tile::Stone
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

impl fmt::Display for World {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        for line in self.tiles.as_slice().chunks(self.shape.x as usize) {
            for &tile in line {
                let symbol = if tile == Tile::Air { '◻' } else { '◼' };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}
