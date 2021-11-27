mod compare;
mod decoder;
mod iter;
mod solver;
mod types;
mod utils;

use decoder::decode_board;
use types::Set;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(board: &[i32]) -> Result<Set, JsValue> {
    let board = decode_board(board);
    let set = solver::solve(&board);

    match set {
        Ok(set) => Ok(set),
        Err(e) => Err(JsValue::from_str(e)),
    }
}
