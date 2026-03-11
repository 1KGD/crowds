use std::f32;
use std::rc::*;

use dyn_clone::*;
use noise::*;
use wasm_bindgen::prelude::*;

use crate::civ::Citizen;
use crate::game::*;
use crate::util::*;

#[wasm_bindgen]
#[derive(Clone)]
pub struct CreatureProps {
    citizen: Weak<Citizen>,
    pub pos: Vec2,
    pub anim: u8,
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
                citizen: Weak::new(),
            },
        }
    }

    pub(crate) fn tick(&mut self, delta: f32, world: &World) {
        self.behavior.as_mut().tick(delta, world, &mut self.props);
    }

    pub(crate) fn make_citizen(&mut self, citizen: &Rc<Citizen>) {
        self.props.citizen = Rc::downgrade(citizen);
    }

    #[wasm_bindgen(js_name = citizen, getter)]
    pub fn get_citizen(&self) -> Option<Citizen> {
        Option::Some(self.props.citizen.upgrade().unwrap().as_ref().clone())
    }

    pub(crate) fn get_props(&self) -> CreatureProps {
        self.props.clone()
    }
}

pub trait CreatureBehavior: DynClone {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps);
}

dyn_clone::clone_trait_object!(CreatureBehavior);

#[wasm_bindgen]
#[derive(Clone)]
pub struct TestDummy {
    noise: Simplex,
}

impl TestDummy {
    pub fn new(seed: u32) -> Self {
        TestDummy {
            noise: Simplex::new(seed),
        }
    }
}

impl CreatureBehavior for TestDummy {
    fn tick(&mut self, delta: f32, world: &World, creature: &mut CreatureProps) {
        let theta: f32 = f32::floor(
            (self.noise.get([
                (creature.pos.x * 96. / world.shape.x_f32()) as f64,
                (creature.pos.y * 96. / world.shape.y_f32()) as f64,
            ]) + 0.5) as f32
                * 8.,
        ) / 8.
            * f32::consts::PI
            * 2.;
        creature.pos.x += f32::sin(theta) * 5. * delta;
        creature.pos.y += f32::cos(theta) * 5. * delta;

        creature.anim = theta as u8;
    }
}
