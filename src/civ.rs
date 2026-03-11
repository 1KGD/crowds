use std::rc::*;

use wasm_bindgen::prelude::*;

use crate::creature::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Civ {
    name: String,
    citizens: Vec<Rc<Citizen>>,
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

    pub(crate) fn add_citizen(&mut self, citizen: Rc<Citizen>) {
        self.citizens.push(citizen);
    }
}

#[derive(Clone)]
pub struct Task {
    owner: Weak<Citizen>,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Citizen {
    name: String,
    task: Option<Rc<Task>>,
}

#[wasm_bindgen]
impl Citizen {
    pub(crate) fn new() -> Self {
        Citizen {
            name: "Bob".to_owned(),
            task: Option::None,
        }
    }

    #[wasm_bindgen(js_name = name, getter)]
    pub fn get_name(&self) -> String {
        self.name.to_owned()
    }
}
