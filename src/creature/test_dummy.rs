use std::f32;

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
        creature.pos = Vec2::from(pos);
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        if creature.citizen.is_some() {
            let creature_clone: CreatureProps = creature.clone();
            let mut citizen: RefMut<'_, Citizen> =
                creature_clone.citizen.as_ref().unwrap().borrow_mut();
            if citizen.task.is_some() {
                let citizen_clone = citizen.clone();
                let task: RefMut<'_, Task> = citizen_clone.task.as_ref().unwrap().borrow_mut();
                self.move_towards(creature, task.target);
                if creature.pos.dist_to(Vec2::from(task.target)) <= 0.1 {
                    (*task.complete.as_ref())(&creature, &mut citizen);
                }
            } else {
                citizen.request_task();
            }
        }
    }
}
