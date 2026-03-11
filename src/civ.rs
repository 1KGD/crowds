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

    pub(crate) fn add_citizen(&mut self, creature: &mut Rc<Creature>) {
        self.citizens.push(Citizen::new(creature));
    }
}

#[derive(Clone)]
pub struct Task {
    owner: Weak<Citizen>,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Citizen {
    creature: Rc<Creature>,
    task: Option<Rc<Task>>,
}

impl Citizen {
    pub fn new(creature: &mut Rc<Creature>) -> Rc<Self> {
        let rc: Rc<Citizen> = Rc::new(Citizen {
            creature: Rc::clone(creature),
            task: Option::None,
        });
        Rc::make_mut(creature).make_citizen(&rc.clone());
        rc
    }
}
