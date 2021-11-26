use crate::types::Card;

#[allow(dead_code)]
pub fn make_card(shape: i32, number: i32, color: i32, shade: i32) -> Card {
    Card {
        shape,
        number,
        color,
        shade,
    }
}
