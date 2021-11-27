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
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_i32(a: i32);
}

#[wasm_bindgen]
pub fn solve(board: &[i32]) -> Result<Set, JsValue> {
    log_i32(board[0]);

    let board = decode_board(board);
    let set = solver::solve(&board);

    match set {
        Ok(set) => Ok(set),
        Err(e) => Err(JsValue::from_str(e)),
    }
}
