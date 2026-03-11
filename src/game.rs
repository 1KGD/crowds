use std::rc::Rc;

use crate::util::*;
use noise::*;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

use crate::civ::*;
use crate::creature::*;
use crate::tiles::*;

const WORLD_SCALE: f32 = 96.;

const SEED: u64 = 1248815214;

#[wasm_bindgen]
#[derive(Clone)]
pub struct World {
    pub shape: TileVec2,
    surface: Vec<Tile>,
    terrain: Vec<Tile>,

    creatures: Vec<Rc<Creature>>,

    civ: Civ,
}

#[wasm_bindgen]
impl World {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> World {
        let shape: TileVec2 = tile_vec2(width as i32, height as i32);
        let size: u32 = width * height;

        let mut rng: SmallRng = SmallRng::seed_from_u64(SEED);

        let surface_noise: Simplex = Simplex::new(rng.next_u32());

        let surface: Vec<Tile> = (0..size)
            .map(|i: u32| {
                Self::surface_gen(
                    tile_vec2((i % width) as i32, (i / width) as i32),
                    &surface_noise,
                    &mut rng,
                )
            })
            .collect();

        let terrain_noise: Simplex = Simplex::new(rng.next_u32());

        let terrain: Vec<Tile> = (0..size)
            .map(|i: u32| {
                Self::terrain_gen(
                    tile_vec2((i % width) as i32, (i / width) as i32),
                    shape.x as u32,
                    &terrain_noise,
                    &surface_noise,
                    &mut rng,
                    &surface,
                )
            })
            .collect();

        let mut civ: Civ = Civ::new();

        let creatures: Vec<Rc<Creature>> = (1..1024)
            .map(|_i: u32| {
                let mut creature: Creature = Creature::new(
                    Box::new(TestDummy::new(rng.next_u32())),
                    vec2(shape.x_f32() / 2., shape.y_f32() / 2.),
                );
                creature.make_citizen();
                Rc::new(creature)
            })
            .collect();

        World {
            shape,
            surface,
            terrain,
            creatures,
            civ,
        }
    }

    fn surface_gen(pos: TileVec2, noise: &Simplex, rng: &mut dyn Rng) -> Tile {
        let loc: [f64; 2] = [
            (pos.x_f32() / WORLD_SCALE) as f64,
            (pos.y_f32() / WORLD_SCALE) as f64,
        ];
        let height: f64 = noise.get(loc);
        if height <= -0.41 {
            if rng.random::<f32>() > 0.99 {
                return Tile::WaterRipples;
            }
            return Tile::Water;
        }
        Tile::Grass
    }

    fn terrain_gen(
        pos: TileVec2,
        width: u32,
        noise: &Simplex,
        surface_noise: &Simplex,
        mut rng: &mut dyn Rng,
        surface: &Vec<Tile>,
    ) -> Tile {
        let loc: [f64; 2] = [
            (pos.x_f32() / WORLD_SCALE * 16.) as f64,
            (pos.y_f32() / WORLD_SCALE * 16.) as f64,
        ];
        let height: f64 = noise.get(loc);
        let surface_height: f64 = surface_noise.get(loc);

        let surface_tile: Tile = *surface.get(pos.to_index(width)).unwrap();

        if surface_tile == Tile::Water {
            if height >= 0.48 && surface_height > -0.4 {
                return Tile::lilypad(&mut rng);
            }
        }
        if surface_tile == Tile::Grass {
            if rng.random::<f32>() > 0.999 {
                return Tile::rock(rng);
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

    #[wasm_bindgen(js_name = creatures, getter)]
    pub fn get_creatures(&self) -> Vec<CreatureProps> {
        self.creatures.iter().map(|c| c.get_props()).collect()
    }

    #[wasm_bindgen(getter)]
    pub fn width(&self) -> u32 {
        self.shape.x as u32
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.shape.y as u32
    }

    #[wasm_bindgen(getter)]
    pub fn civ(&self) -> Civ {
        self.civ.clone()
    }

    pub fn tick(&mut self, delta: f32) {
        let this: World = self.clone();
        self.creatures
            .iter_mut()
            .for_each(|creature: &mut Rc<Creature>| {
                Rc::make_mut(creature).tick(delta, &this);
            });
    }
}
