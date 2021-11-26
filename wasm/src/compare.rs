use crate::types::{Card, Set};

/// Tests if a group of traits are valid
///
/// A group of traits (e.g. shape, color) are valid when either all of them
/// are equal, or they are all different.
fn is_valid_trait_group(v1: i8, v2: i8, v3: i8) -> bool {
    let all_eq = v1 == v2 && v2 == v3;
    let all_diff = v1 != v2 && v1 != v3 && v2 != v3;

    return all_eq || all_diff;
}

/// Tests if a given set of three card positions is valid for the given board
///
/// A set is valid when each trait group (e.g. shape, color) are all equal or
/// all different. Cards are found on the board using the position from the
/// provided set.
pub fn is_set(board: &[Card], set: &Set) -> bool {
    let card1 = &board[set.0];
    let card2 = &board[set.1];
    let card3 = &board[set.2];

    return is_valid_trait_group(card1.shape, card2.shape, card3.shape)
        && is_valid_trait_group(card1.number, card2.number, card3.number)
        && is_valid_trait_group(card1.color, card2.color, card3.color)
        && is_valid_trait_group(card1.shade, card2.shade, card3.shade);
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::utils::make_card;

    #[test]
    fn test_all_eq() {
        let board = [
            make_card(0, 0, 0, 0),
            make_card(0, 0, 0, 0),
            make_card(0, 0, 0, 0),
        ];

        let set = Set(0, 1, 2);
        assert!(is_set(&board, &set));
    }

    #[test]
    fn test_mix() {
        let board = [
            make_card(0, 0, 2, 1),
            make_card(0, 1, 0, 2),
            make_card(0, 2, 1, 0),
        ];

        let set = Set(0, 1, 2);
        assert!(is_set(&board, &set));
    }

    #[test]
    fn test_invalid_set() {
        let board = [
            make_card(0, 0, 0, 0),
            make_card(0, 0, 0, 0),
            make_card(1, 0, 0, 0),
        ];

        let set = Set(0, 1, 2);
        assert_eq!(is_set(&board, &set), false);
    }

    #[test]
    fn test_multiple_errors() {
        let board = [
            make_card(0, 0, 1, 2),
            make_card(0, 1, 0, 1),
            make_card(1, 2, 2, 1),
        ];

        let set = Set(0, 1, 2);
        assert_eq!(is_set(&board, &set), false);
    }
}
