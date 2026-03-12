use std::f32;

use crate::creature::*;
use noise::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {
    noise: Simplex,
}

impl TestDummy {
    pub fn new(seed: u32) -> Self {
        let noise: Simplex = Simplex::new(seed);
        TestDummy { noise }
    }

    pub fn move_towards(&mut self, pos: TileVec2) {}
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        if creature.citizen.is_some() {
            let mut citizen: RefMut<'_, Citizen> = creature.citizen.as_ref().unwrap().borrow_mut();
            citizen.request_task();
        }
    }
}
