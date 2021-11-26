use wasm_bindgen::prelude::*;

#[derive(Debug, PartialEq)]
pub struct Card {
    pub shape: i32,
    pub number: i32,
    pub color: i32,
    pub shade: i32,
}

#[wasm_bindgen]
#[derive(Debug, PartialEq)]
pub struct Set(pub usize, pub usize, pub usize);

pub type Board = Vec<Card>;
