use wasm_bindgen::prelude::*;

#[derive(Clone, Copy)]
#[wasm_bindgen]
pub struct World {
    name: &'static str,
}

#[wasm_bindgen]
impl World {
    pub fn new() -> World {
        World {
            name: "TODO: World Name",
        }
    }

    pub fn get_name(&self) -> String {
        return self.name.to_string();
    }
}

#[wasm_bindgen]
pub struct Game {
    pub world: World,
}

#[wasm_bindgen]
impl Game {
    pub fn new() -> Game {
        Game {
            world: World::new(),
        }
    }
}
