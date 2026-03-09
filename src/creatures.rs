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
        self.behavior.tick();
    }
}
pub trait CreatureBehavior: DynClone {
    fn tick(&self);
}

dyn_clone::clone_trait_object!(CreatureBehavior);

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {}

impl CreatureBehavior for TestDummy {
    fn tick(&self) {}
}
