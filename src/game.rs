use noise_perlin::*;
use wasm_bindgen::prelude::*;

const WORLD_SCALE: f32 = 96.;

const SURFACE_NOISE_SEED: f32 = 0.6;
const TERRAIN_NOISE_SEED: f32 = 0.2;

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
#[repr(u16)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Tile {
    Air = 0,
    Grass = 1,

    Sprout = 2,

    TallGrass = 408,
}

#[wasm_bindgen]
pub struct World {
    shape: Vec2,
    surface: Vec<Tile>,
    terrain: Vec<Tile>,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> World {
        let shape: Vec2 = vec2(width as i32, height as i32);
        let size: u32 = width * height;

        let surface = (0..size)
            .map(|i: u32| Self::surface_gen(vec2((i % width) as i32, (i / width) as i32), shape))
            .collect();

        let terrain = (0..size)
            .map(|i: u32| Self::terrain_gen(vec2((i % width) as i32, (i / width) as i32), shape))
            .collect();

        World {
            shape,
            surface,
            terrain,
        }
    }

    fn surface_gen(pos: Vec2, shape: Vec2) -> Tile {
        let height = perlin_3d(
            pos.x_f32() / shape.x_f32() * WORLD_SCALE,
            pos.y_f32() / shape.y_f32() * WORLD_SCALE,
            SURFACE_NOISE_SEED,
        );
        if height >= 0.3 {
            return Tile::TallGrass;
        }
        Tile::Grass
    }

    fn terrain_gen(pos: Vec2, shape: Vec2) -> Tile {
        let height = perlin_3d(
            pos.x_f32() / shape.x_f32() * WORLD_SCALE,
            pos.y_f32() / shape.y_f32() * WORLD_SCALE,
            TERRAIN_NOISE_SEED,
        );
        if height >= 0.4 {
            return Tile::Sprout;
        }
        Tile::Air
    }

    #[wasm_bindgen(js_name = surfacePtr, getter)]
    pub fn surface_ptr(&self) -> *const Tile {
        self.surface.as_ptr()
    }

    #[wasm_bindgen(js_name = terrainPtr, getter)]
    pub fn terrain_ptr(&self) -> *const Tile {
        self.terrain.as_ptr()
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
