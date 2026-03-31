use std::f32;

use basic_pathfinding::{coord::Coord, pathfinding::*};
use wasm_bindgen::prelude::*;

use crate::creature::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {}

impl TestDummy {
    pub fn new() -> Self {
        TestDummy {}
    }

    pub fn move_towards(&mut self, creature: &mut CreatureProps, pos: TileVec2, world: &World) {
        let pathfound = find_path(
            &world.current_grid.as_ref().unwrap(),
            Coord::new(creature.pos.0 as i32, creature.pos.1 as i32),
            Coord::new(pos.0, pos.1),
            SearchOpts {
                ..Default::default()
            },
        );

        if pathfound.is_none() {
            return;
        }
        let path = pathfound.unwrap();

        let next = path.get(1);
        if next.is_none() {
            return;
        }
        let next = next.unwrap();
        creature.pos.0 += (next.x as f32 - creature.pos.0) / 100.;
        creature.pos.1 += (next.y as f32 - creature.pos.1) / 100.;
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
