use crate::{
    compare::is_set,
    iter::next_set,
    types::{Board, Set},
};

/// Solves a board to find the first valid set.
///
/// If a set is found, the function will return an `Ok` result with the card
/// positions of the set. If a set is not found or the board is too small, an
/// `Err` result will be returned.
pub fn solve(board: &Board) -> Result<Set, &'static str> {
    if board.len() < 3 {
        return Err("board is too small");
    }

    let mut set = Set(0, 1, 2);

    loop {
        if is_set(board, &set) {
            return Ok(set);
        }

        if set.0 == board.len() - 3 {
            return Err("no sets exist");
        }

        set = next_set(set, board.len());
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::utils::make_card;

    #[test]
    fn test_small_board() {
        let board = vec![make_card(0, 0, 0, 0), make_card(0, 0, 0, 0)];
        assert_eq!(solve(&board), Err("board is too small"));
    }

    #[test]
    fn test_no_solution() {
        let board = vec![
            make_card(0, 0, 0, 0),
            make_card(0, 0, 0, 0),
            make_card(1, 0, 0, 0),
        ];

        assert_eq!(solve(&board), Err("no sets exist"));
    }

    #[test]
    fn test_valid_solve() {
        let board = vec![
            make_card(0, 0, 0, 0),
            make_card(1, 0, 2, 1),
            make_card(2, 0, 2, 1),
            make_card(1, 2, 0, 2),
            make_card(1, 1, 1, 0),
        ];

        assert_eq!(solve(&board), Ok(Set(1, 3, 4)));
    }
}
