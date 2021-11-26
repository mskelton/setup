pub struct Card {
    pub shape: i8,
    pub number: i8,
    pub color: i8,
    pub shade: i8,
}

#[derive(Debug, PartialEq)]
pub struct Set(pub usize, pub usize, pub usize);
