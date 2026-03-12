use std::f32;
use std::rc::*;
use std::cell::*;

use dyn_clone::*;
use wasm_bindgen::prelude::*;

use crate::civ::*;
use crate::game::*;
use crate::util::*;

pub mod test_dummy;

#[wasm_bindgen]
#[derive(Clone)]
pub struct CreatureProps {
    pub(crate) citizen: Option<Rc<RefCell<Citizen>>>,
    pub pos: Vec2,
    pub anim: u8,
}

#[wasm_bindgen]
impl CreatureProps {
    #[wasm_bindgen(js_name=citizen, getter)]
    pub fn get_citizen(&self) -> Option<Citizen> {
        if self.citizen.is_none() {
            return Option::None;
        }
        Option::Some(self.citizen.clone().unwrap().as_ref().clone().into_inner())
    }
}

#[wasm_bindgen]
#[derive(Clone)]
pub struct Creature {
    behavior: Box<dyn CreatureBehavior>,
    props: CreatureProps,
}

#[wasm_bindgen]
impl Creature {
    pub(crate) fn new(behavior: Box<dyn CreatureBehavior>, pos: Vec2) -> Creature {
        Creature {
            behavior,
            props: CreatureProps {
                pos,
                anim: 0,
                citizen: Option::None,
            },
        }
    }

    pub(crate) fn tick(&mut self, delta: f32, world: &World) {
        self.behavior.as_mut().tick(delta, world, &mut self.props);
    }

    pub(crate) fn make_citizen(&mut self, civ: &mut Civ, name: String) {
        let citizen: Rc<RefCell<Citizen>> = Rc::new(RefCell::new(Citizen::new(name)));
        self.props.citizen = Option::Some(Rc::clone(&citizen));
        civ.add_citizen(citizen);
    }

    pub(crate) fn get_props(&self) -> CreatureProps {
        self.props.clone()
    }
}

pub trait CreatureBehavior: DynClone {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps);
}

dyn_clone::clone_trait_object!(CreatureBehavior);
