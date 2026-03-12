use std::cell::*;
use std::rc::*;

use wasm_bindgen::prelude::*;

use crate::util::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct Civ {
    name: String,
    citizens: Vec<Rc<RefCell<Citizen>>>,
    tasks: Vec<Rc<Task>>,
}

#[wasm_bindgen]
impl Civ {
    pub(crate) fn new() -> Self {
        Civ {
            name: "TestCiv".to_owned(),
            citizens: Vec::new(),
            tasks: Vec::new(),
        }
    }

    #[wasm_bindgen(js_name = name, getter)]
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub(crate) fn add_citizen(&mut self, citizen: Rc<RefCell<Citizen>>) {
        self.citizens.push(citizen);
    }

    pub(crate) fn tick(&mut self) {
        let this: Civ = self.clone();
        self.citizens
            .iter_mut()
            .for_each(|citizen: &mut Rc<RefCell<Citizen>>| {
                citizen.borrow_mut().tick(&this);
            });
    }

    pub(crate) fn request_task(&self) -> Option<Rc<Task>> {
        for task in &self.tasks {
            if !task.owned {
                return Option::Some(Rc::clone(task));
            }
        }
        Option::None
    }
}

#[derive(Clone)]
pub struct Task {
    pub owned: bool,
    pub target: TileVec2,
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Citizen {
    name: String,
    pub(crate) task: Option<Rc<Task>>,
    wants_task: bool,
}

#[wasm_bindgen]
impl Citizen {
    pub(crate) fn new(name: String) -> Self {
        Citizen {
            name: name,
            task: Option::None,
            wants_task: false,
        }
    }

    #[wasm_bindgen(js_name = name, getter)]
    pub fn get_name(&self) -> String {
        self.name.to_owned()
    }

    pub(crate) fn tick(&mut self, civ: &Civ) {
        if self.wants_task {
            self.task = civ.request_task();
            if self.task.is_some() {
                self.wants_task = false;
            }
        }
    }

    pub(crate) fn request_task(&mut self) {
        if self.task.is_none() {
            self.wants_task = true;
        }
    }
}
