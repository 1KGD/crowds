use wasm_bindgen::prelude::*;
use noise::*;
use crate::creature::*;

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
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        let theta: f32 = f32::floor(
            (self.noise.get([
                (creature.pos.x * 96. / world.shape.x_f32()) as f64,
                (creature.pos.y * 96. / world.shape.y_f32()) as f64,
            ]) + 0.5) as f32
                * 4.,
        ) / 4.
            * f32::consts::PI
            * 2.;
        creature.pos.x += f32::sin(theta) * 5. * delta;
        creature.pos.y += f32::cos(theta) * 5. * delta;

        creature.anim = theta as u8;
    }
}
