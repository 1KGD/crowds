use crate::util::*;
use noise::*;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

const WORLD_SCALE: f32 = 96.;

const SEED: u64 = 0;

#[wasm_bindgen]
#[repr(u16)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Tile {
    Air = 0,
    Grass = 1,

    Sprout = 2,
    Flowerpot = 36,

    Lillypad0 = 3,
    Lillypad1 = 4,
    Lillypad2 = 5,
    Lillypad3 = 6,

    Water = 284,
    WaterRipples = 124,

    TallGrass = 408,
}

impl Tile {
    pub fn lilypad(mut rng: &mut dyn Rng) -> Tile {
        return *[
            Tile::Lillypad0,
            Tile::Lillypad1,
            Tile::Lillypad2,
            Tile::Lillypad3,
        ]
        .choose(&mut rng)
        .unwrap();
    }
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

        let mut rng: SmallRng = SmallRng::seed_from_u64(SEED);

        let surface_noise = Simplex::new(rng.next_u32());

        let surface = (0..size)
            .map(|i: u32| {
                Self::surface_gen(
                    vec2((i % width) as i32, (i / width) as i32),
                    &surface_noise,
                    &mut rng,
                )
            })
            .collect();

        let terrain_noise = Simplex::new(rng.next_u32());

        let terrain = (0..size)
            .map(|i: u32| {
                Self::terrain_gen(
                    vec2((i % width) as i32, (i / width) as i32),
                    shape.x as u32,
                    &terrain_noise,
                    &surface_noise,
                    &mut rng,
                    &surface,
                )
            })
            .collect();

        World {
            shape,
            surface,
            terrain,
        }
    }

    fn surface_gen(pos: Vec2, noise: &Simplex, rng: &mut dyn Rng) -> Tile {
        let loc = [
            (pos.x_f32() / WORLD_SCALE) as f64,
            (pos.y_f32() / WORLD_SCALE) as f64,
        ];
        let height = noise.get(loc);
        if height <= -0.41 {
            if rng.random::<f32>() > 0.99 {
                return Tile::WaterRipples;
            }
            return Tile::Water;
        }
        Tile::Grass
    }

    fn terrain_gen(
        pos: Vec2,
        width: u32,
        noise: &Simplex,
        surface_noise: &Simplex,
        mut rng: &mut dyn Rng,
        surface: &Vec<Tile>,
    ) -> Tile {
        let loc = [
            (pos.x_f32() / WORLD_SCALE * 16.) as f64,
            (pos.y_f32() / WORLD_SCALE * 16.) as f64,
        ];
        let height = noise.get(loc);
        let surface_height = surface_noise.get(loc);

        if *surface.get(pos.to_index(width)).unwrap() == Tile::Water {
            if height >= 0.48 && surface_height > -0.415 {
                return Tile::lilypad(&mut rng);
            }
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
