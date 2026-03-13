use rand::prelude::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[repr(u16)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Tile {
    Air = 0,
    Grass = 1,

    Sprout = 2,
    Flowerpot = 36,

    Lillypad0 = 3,
    Lillypad1 = 4,
    Lillypad2 = 5,
    Lillypad3 = 6,

    Rock0 = 207,
    Rock1 = 208,
    Rock2 = 209,
    Rock3 = 210,
    Rock4 = 211,

    Water = 284,
    WaterRipples = 124,

    TallGrass = 408,
}

impl Tile {
    pub fn lilypad(mut rng: &mut dyn Rng) -> Tile {
        return *[
            Tile::Lillypad0,
            Tile::Lillypad1,
            Tile::Lillypad2,
            Tile::Lillypad3,
        ]
        .choose(&mut rng)
        .unwrap();
    }

    pub fn rock(mut rng: &mut dyn Rng) -> Tile {
        return *[
            Tile::Rock0,
            Tile::Rock1,
            Tile::Rock2,
            Tile::Rock3,
            Tile::Rock4,
        ]
        .choose(&mut rng)
        .unwrap();
    }
}
