use std::rc::Rc;

use wasm_bindgen::prelude::*;

use crate::creature::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Civ {
    citizens: Vec<Citizen>,
}

#[wasm_bindgen]
impl Civ {
    pub(crate) fn new() -> Self {
        Civ {
            citizens: Vec::new(),
        }
    }

    pub(crate) fn add_citizen(&mut self, creature: Rc<Creature>) {
        self.citizens.push(Citizen::new(creature));
    }
}

#[derive(Clone)]
pub struct Citizen {
    creature: Rc<Creature>,
}

impl Citizen {
    pub fn new(creature: Rc<Creature>) -> Self {
        Citizen { creature }
    }
}
