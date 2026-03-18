use std::rc::Rc;

use crate::util::*;
use noise::*;
use rand::prelude::*;
use wasm_bindgen::prelude::*;

use crate::civ::*;
use crate::creature::test_dummy::TestDummy;
use crate::creature::*;
use crate::tiles::*;

const WORLD_SCALE: f32 = 96.;

const SEED: u64 = 1248815214;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Game {
    pub shape: TileVec2,
    surface: Vec<Tile>,
    terrain: Vec<Tile>,

    creatures: Vec<Rc<Creature>>,

    civ: Civ,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Self {
        let shape: TileVec2 = TileVec2(width as i32, height as i32);
        let size: u32 = width * height;

        let mut rng: SmallRng = SmallRng::seed_from_u64(SEED);

        let surface_noise: Simplex = Simplex::new(rng.next_u32());

        let surface: Vec<Tile> = (0..size)
            .map(|i: u32| {
                Self::surface_gen(
                    TileVec2((i % width) as i32, (i / width) as i32),
                    &surface_noise,
                    &mut rng,
                )
            })
            .collect();

        let terrain_noise: Simplex = Simplex::new(rng.next_u32());

        let terrain: Vec<Tile> = (0..size)
            .map(|i: u32| {
                Self::terrain_gen(
                    TileVec2((i % width) as i32, (i / width) as i32),
                    shape.0 as u32,
                    &terrain_noise,
                    &surface_noise,
                    &mut rng,
                    &surface,
                )
            })
            .collect();

        let mut this: Self = Self {
            shape,
            surface,
            terrain,
            creatures: Vec::new(),
            civ: Civ::new(),
        };

        (0..8).for_each(|i: u32| {
            let mut creature: Creature =
                Creature::new(Box::new(TestDummy::new()), Vec2::from(shape) / 2.);
            creature.make_citizen(&mut this.civ, format!("thing {}", i + 1));
            this.creatures.push(Rc::new(creature));
        });

        (0..1016).for_each(|_i: u32| {
            this.creatures.push(Rc::new(Creature::new(
                Box::new(TestDummy::new()),
                Vec2::from(shape) / 2.,
            )))
        });

        this
    }

    fn surface_gen(pos: TileVec2, noise: &Simplex, rng: &mut dyn Rng) -> Tile {
        let loc: Vec2 = Vec2::from(pos) / WORLD_SCALE;
        let height: f64 = noise.get([loc.0 as f64, loc.1 as f64]);
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
        let loc: Vec2 = Vec2::from(pos) / WORLD_SCALE * 16.;
        let height: f64 = noise.get([loc.0 as f64, loc.1 as f64]);
        let surface_height: f64 = surface_noise.get([loc.0 as f64, loc.1 as f64]);

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
        self.shape.0 as u32
    }

    #[wasm_bindgen(getter)]
    pub fn height(&self) -> u32 {
        self.shape.1 as u32
    }

    #[wasm_bindgen(getter)]
    pub fn civ(&self) -> Civ {
        self.civ.clone()
    }

    pub fn tick(&mut self, delta: f32) {
        let this: Game = self.clone();
        self.creatures
            .iter_mut()
            .for_each(|creature: &mut Rc<Creature>| {
                Rc::make_mut(creature).tick(delta, &this);
            });
        self.civ.tick();
    }
}
