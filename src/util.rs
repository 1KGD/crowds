use std::ops::*;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
pub struct Vec2(pub f32, pub f32);

impl From<TileVec2> for Vec2 {
    fn from(value: TileVec2) -> Self {
        Vec2(value.0 as f32, value.1 as f32)
    }
}

impl Add<Self> for Vec2 {
    fn add(self, rhs: Self) -> Self::Output {
        Self(self.0 + rhs.0, self.1 + rhs.1)
    }

    type Output = Self;
}

impl AddAssign<Self> for Vec2 {
    fn add_assign(&mut self, other: Self) {
        *self = Self(self.0 + other.0, self.1 + other.1)
    }
}

impl Sub<Self> for Vec2 {
    fn sub(self, rhs: Self) -> Self::Output {
        Self(self.0 - rhs.0, self.1 - rhs.1)
    }

    type Output = Self;
}

impl Mul<f32> for Vec2 {
    fn mul(self, rhs: f32) -> Self::Output {
        Vec2(self.0 * rhs, self.1 * rhs)
    }

    type Output = Self;
}

impl Div<f32> for Vec2 {
    fn div(self, rhs: f32) -> Self::Output {
        Vec2(self.0 / rhs, self.1 / rhs)
    }

    type Output = Self;
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct TileVec2(pub i32, pub i32);

impl TileVec2 {
    pub fn to_index(&self, width: u32) -> usize {
        self.0 as usize + self.1 as usize * width as usize
    }

    pub fn adjacent(&self) -> Vec<Self> {
        let &TileVec2(x, y) = self;
        vec![
            TileVec2(x + 1, y),
            TileVec2(x - 1, y),
            TileVec2(x, y + 1),
            TileVec2(x, y + 1),
        ]
    }
}

impl From<Vec2> for TileVec2 {
    fn from(value: Vec2) -> Self {
        TileVec2(value.0 as i32, value.1 as i32)
    }
}
