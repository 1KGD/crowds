use std::f32;
use std::ops::*;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, PartialOrd)]
pub struct Vec2(pub f32, pub f32);

impl Vec2 {
    pub fn dist_to(&self, other: Vec2) -> f32 {
        f32::sqrt(f32::powi(self.0 - other.0, 2) + f32::powi(self.1 - other.1, 2))
    }
}

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
        Self(self.0 * rhs, self.1 * rhs)
    }

    type Output = Self;
}

impl Div<f32> for Vec2 {
    fn div(self, rhs: f32) -> Self::Output {
        Self(self.0 / rhs, self.1 / rhs)
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
}

impl TileVec2 {
    pub fn dist_to(&self, other: Self) -> f32 {
        Vec2::from(*self).dist_to(Vec2::from(other))
    }
}

impl From<Vec2> for TileVec2 {
    fn from(value: Vec2) -> Self {
        Self(value.0 as i32, value.1 as i32)
    }
}

impl Add<Self> for TileVec2 {
    fn add(self, rhs: Self) -> Self::Output {
        Self(self.0 + rhs.0, self.1 + rhs.1)
    }

    type Output = Self;
}

impl AddAssign<Self> for TileVec2 {
    fn add_assign(&mut self, other: Self) {
        *self = Self(self.0 + other.0, self.1 + other.1)
    }
}

impl Sub<Self> for TileVec2 {
    fn sub(self, rhs: Self) -> Self::Output {
        Self(self.0 - rhs.0, self.1 - rhs.1)
    }

    type Output = Self;
}

impl Mul<i32> for TileVec2 {
    fn mul(self, rhs: i32) -> Self::Output {
        Self(self.0 * rhs, self.1 * rhs)
    }

    type Output = Self;
}

impl Div<i32> for TileVec2 {
    fn div(self, rhs: i32) -> Self::Output {
        Self(self.0 / rhs, self.1 / rhs)
    }

    type Output = Self;
}
