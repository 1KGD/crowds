use std::f32;

use noise::*;
use wasm_bindgen::prelude::*;

use crate::creature::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {}

impl TestDummy {
    pub fn new() -> Self {
        TestDummy {}
    }

    pub fn move_towards(&mut self, creature: &mut CreatureProps, pos: TileVec2) {
        creature.pos += (Vec2::from(pos) - creature.pos) / 100000.
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        if creature.citizen.is_some() {
            let mut creature_clone = creature.clone();
            let mut citizen: RefMut<'_, Citizen> =
                creature_clone.citizen.as_ref().unwrap().borrow_mut();
            if citizen.task.is_some() {
                creature_clone.pos.0 += 0.1;
                self.move_towards(creature, citizen.task.as_ref().unwrap().borrow().target);
            } else {
                citizen.request_task();
            }
        }
    }
}
