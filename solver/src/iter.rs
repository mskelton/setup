use crate::types::Set;

/// Finds the next possible set on the board.
///
/// This function will not check the board length when incrementing, so take
/// care to prevent overflow before calling this function.
pub fn next_set(set: Set, board_length: usize) -> Set {
    if set.1 == board_length - 2 {
        return Set(set.0 + 1, set.0 + 2, set.0 + 3);
    }

    if set.2 == board_length - 1 {
        return Set(set.0, set.1 + 1, set.1 + 2);
    }

    return Set(set.0, set.1, set.2 + 1);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_increment_last() {
        assert_eq!(next_set(Set(0, 1, 2), 4), Set(0, 1, 3));
        assert_eq!(next_set(Set(0, 1, 3), 5), Set(0, 1, 4));
    }

    #[test]
    fn test_increment_second() {
        assert_eq!(next_set(Set(0, 1, 3), 4), Set(0, 2, 3));
        assert_eq!(next_set(Set(0, 1, 5), 6), Set(0, 2, 3));
    }

    #[test]
    fn test_increment_first() {
        assert_eq!(next_set(Set(0, 2, 3), 4), Set(1, 2, 3));
        assert_eq!(next_set(Set(0, 4, 5), 6), Set(1, 2, 3));
        assert_eq!(next_set(Set(1, 4, 5), 6), Set(2, 3, 4));
    }
}
