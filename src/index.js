import { solve } from "solver"

const board = new Int32Array(12)
const result = solve(board)

board[0] = 1
board[1] = 1

console.log(board)
console.log(result[0], result[1], result[2])
