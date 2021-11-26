use crate::types::Card;

pub fn make_card(shape: i8, number: i8, color: i8, shade: i8) -> Card {
    Card {
        shape,
        number,
        color,
        shade,
    }
}
