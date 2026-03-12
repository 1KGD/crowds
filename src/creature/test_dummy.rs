use std::f32;

use crate::creature::*;
use noise::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {
    noise: Simplex,
    heading: f32,
}

impl TestDummy {
    pub fn new(seed: u32) -> Self {
        let noise = Simplex::new(seed);
        TestDummy {
            noise: noise,
            heading: noise.get([0.3, 0.6]) as f32 * f32::consts::PI * 2.,
        }
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        self.heading += self.noise.get([
            (creature.pos.x * 96. / world.shape.x_f32()) as f64,
            (creature.pos.y * 96. / world.shape.y_f32()) as f64,
        ]) as f32
            / 8.
            * f32::consts::PI
            * 2.
            * delta;
        let theta = f32::floor(self.heading * 8.) / 8. * f32::consts::PI * 2.;
        creature.pos.x += f32::sin(theta) * 5. * delta;
        creature.pos.y += f32::cos(theta) * 5. * delta;

        creature.anim = (theta % 1.) as u8;
    }
}
