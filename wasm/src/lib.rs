mod compare;
mod decoder;
mod iter;
mod solver;
mod types;
mod utils;

use decoder::decode_board;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
// pub fn solve(board: &[i32]) -> Result<JsValue, JsValue> {
pub fn solve(board: &[i32]) -> () {
    let board = decode_board(board);
    let set = solver::solve(&board);

    // return set;
}
