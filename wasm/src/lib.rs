mod compare;
mod iter;
mod solver;
mod types;
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve() {
    solver::solve(&[]);
}
