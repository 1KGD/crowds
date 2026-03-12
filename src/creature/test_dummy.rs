use std::f32;

use noise::*;
use pathfinding::prelude::*;
use wasm_bindgen::prelude::*;

use crate::creature::*;

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

    pub fn move_towards(&mut self, creature: &mut CreatureProps, pos: TileVec2) {
        let path = bfs(
            &TileVec2::from(creature.pos),
            |p| p.adjacent(),
            |p| *p == pos,
        );
        creature.pos += (Vec2::from(*path.unwrap().first().unwrap()) - creature.pos) / 100.
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        if creature.citizen.is_some() {
            let mut creature_clone: CreatureProps = creature.clone();
            let mut citizen: RefMut<'_, Citizen> = creature.citizen.as_ref().unwrap().borrow_mut();
            citizen.request_task();

            if citizen.task.is_some() {
                self.move_towards(&mut creature_clone, citizen.task.as_ref().unwrap().target);
            }
        }
    }
}
