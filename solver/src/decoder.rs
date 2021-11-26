use crate::types::{Board, Card};

/// Decodes a single trait from a card
///
/// Because traits have three possible options, each trait is represented
/// by two bits. As such, the bits must be right shifted a specific amount
/// based on the position of the trait in the binary number.
fn decode_trait(int: i32, n: i8) -> i32 {
    (int >> n) & 3
}

/// Decodes a single card from the binary representation into a Card
/// struct.
fn decode_card(binary_card: i32) -> Card {
    Card {
        shape: decode_trait(binary_card, 0),
        number: decode_trait(binary_card, 2),
        color: decode_trait(binary_card, 4),
        shade: decode_trait(binary_card, 6),
    }
}

/// Decodes a binary board passed from JS into it's Rust equivalent
///
/// This allows for easier access of card properties later on when
/// finding sets.
pub fn decode_board(binary_board: &[i32]) -> Board {
    let mut board = Vec::new();

    for &item in binary_board {
        board.push(decode_card(item));
    }

    return board;
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::utils::make_card;

    #[test]
    fn test_decode_board() {
        let board = decode_board(&[6]);
        assert_eq!(board, vec![make_card(2, 1, 0, 0)]);
    }
}
