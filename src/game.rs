use crate::util::*;
use noise::*;
use wasm_bindgen::prelude::*;

const WORLD_SCALE: f32 = 96.;

const SEED: u32 = 0;

#[wasm_bindgen]
#[repr(u16)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Tile {
    Air = 0,
    Grass = 1,

    Sprout = 2,
    Flowerpot = 36,

    Rock = 284,

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

        let mut noise = SuperSimplex::new(SEED);

        noise.set_seed(1);
        let surface = (0..size)
            .map(|i: u32| Self::surface_gen(vec2((i % width) as i32, (i / width) as i32), shape))
            .collect();

        noise.set_seed(2);
        let terrain = (0..size)
            .map(|i: u32| {
                Self::terrain_gen(vec2((i % width) as i32, (i / width) as i32), &mut noise)
            })
            .collect();

        World {
            shape,
            surface,
            terrain,
        }
    }

    fn surface_gen(pos: Vec2, shape: Vec2) -> Tile {
        Tile::Grass
    }

    fn terrain_gen(pos: Vec2, noise: &mut SuperSimplex) -> Tile {
        let height: f64 = noise.get([(pos.x_f32() / 32.) as f64, (pos.y_f32() / 32.) as f64]);
        if height >= 0.4 {
            return Tile::Rock;
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
