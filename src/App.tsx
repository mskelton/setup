import { attempt_solve } from "./utils/solver"
import { Card } from "./utils/types"

function quick_card(
  shape: number,
  number: number,
  color: number,
  shade: number
): Card {
  return { color, number, shade, shape }
}
export function App() {
  function handleSolve() {
    const set = attempt_solve([
      quick_card(0, 0, 0, 0),
      quick_card(0, 1, 2, 0),
      quick_card(0, 0, 0, 0),
      quick_card(0, 1, 0, 0),
      quick_card(0, 0, 0, 1),
    ])

    console.log(set)
  }

  return (
    <main>
      <button onClick={handleSolve}>Solve</button>
    </main>
  )
}
