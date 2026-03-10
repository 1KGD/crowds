use std::rc::Rc;

use wasm_bindgen::prelude::*;

use crate::creature::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Civ {
    name: String,
    citizens: Vec<Citizen>,
}

#[wasm_bindgen]
impl Civ {
    pub(crate) fn new() -> Self {
        Civ {
            name: "TestCiv".to_owned(),
            citizens: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = name, getter)]
    pub fn get_name(&self) -> String {
        self.name.clone()
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
