import { solve } from "solver"
import { Board, Card, EncodedCard } from "./types"

function encode_card(card: Card): EncodedCard {
  let encodedCard = 0

  for (const trait of [card.shape, card.number, card.color, card.shade]) {
    encodedCard <<= 2
    encodedCard |= trait
  }

  return encodedCard
}

export function attempt_solve(board: Board) {
  const encodedBoard = board.map(encode_card)

  try {
    const result = solve(encodedBoard as unknown as Int32Array)
    return [result[0], result[1], result[2]]
  } catch (e) {
    console.warn(e)
  }
}
