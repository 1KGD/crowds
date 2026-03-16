use std::f32;
use std::path;

use wasm_bindgen::prelude::*;

use crate::creature::*;
use crate::pathfinding::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {}

impl TestDummy {
    pub fn new() -> Self {
        TestDummy {}
    }

    pub fn move_towards(&mut self, creature: &mut CreatureProps, pos: TileVec2, world: &World) {
        let pathfinder: Pathfinder<'_> = Pathfinder::new(world, TileVec2::from(creature.pos), pos);
        let next_pos: Option<TileVec2> = pathfinder.next_pos();
        if next_pos.is_none() {
            return;
        }
        creature.pos.clone_from(&Vec2::from(next_pos.unwrap()));
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, _delta: f32, world: &World, creature: &mut CreatureProps) {
        if creature.citizen.is_some() {
            let creature_clone: CreatureProps = creature.clone();
            let mut citizen: RefMut<'_, Citizen> =
                creature_clone.citizen.as_ref().unwrap().borrow_mut();
            if citizen.task.is_some() {
                let citizen_clone: Citizen = citizen.clone();
                let task: RefMut<'_, Task> = citizen_clone.task.as_ref().unwrap().borrow_mut();
                self.move_towards(creature, task.target, world);
                if creature.pos.dist_to(Vec2::from(task.target)) <= 0.1 {
                    (*task.complete.as_ref())(&creature, &mut citizen);
                }
            } else {
                citizen.request_task();
            }
        }
    }
}
