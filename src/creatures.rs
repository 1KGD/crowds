use dyn_clone::*;
use wasm_bindgen::prelude::*;

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

    pub fn tick(&mut self) {
        let this: Box<Creature> = Box::new(self.clone());
        let new: Creature = self.behavior.as_mut().tick(this.as_ref().clone());
        self.clone_from(&new);
    }
}

pub trait CreatureBehavior: DynClone {
    fn tick(&mut self, creature: Creature) -> Creature;
}

dyn_clone::clone_trait_object!(CreatureBehavior);

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, mut creature: Creature) -> Creature {
        creature.pos.x += 0.1;
        creature
    }
}
