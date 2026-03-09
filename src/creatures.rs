use std::f32;

use dyn_clone::*;
use noise::*;
use wasm_bindgen::prelude::*;

use crate::game::*;
use crate::util::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Creature {
    behavior: Box<dyn CreatureBehavior>,
    pub pos: Vec2,
}

impl Creature {
    pub fn new(behavior: Box<dyn CreatureBehavior>, pos: Vec2) -> Creature {
        Creature { behavior, pos }
    }

    pub fn tick(&mut self, delta: f32, world: &World) {
        let this: Creature = self.clone();
        let new: Creature = self.behavior.as_mut().tick(delta, world, this);
        self.clone_from(&new);
        std::mem::drop(new);
    }
}

pub trait CreatureBehavior: DynClone {
    fn tick(&mut self, delta: f32, world: &World, creature: Creature) -> Creature;
}

dyn_clone::clone_trait_object!(CreatureBehavior);

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {
    noise: Simplex,
}

impl TestDummy {
    pub fn new(seed: u32) -> Self {
        TestDummy {
            noise: Simplex::new(seed),
        }
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, mut creature: Creature) -> Creature {
        let theta: f32 = self.noise.get([
            (creature.pos.x * 64. / world.shape.x_f32()) as f64,
            (creature.pos.y * 64. / world.shape.y_f32()) as f64,
        ]) as f32
            * f32::consts::PI
            * 2.;
        creature.pos.x += f32::sin(theta) * 5. * delta;
        creature.pos.y += f32::cos(theta) * 5. * delta;
        creature
    }
}
