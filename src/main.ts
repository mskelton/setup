import "./main.css"
import "./utils/stream"
import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { load, ObjectDetection } from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import { drawBox, getContext } from "./utils/canvas"

const video = document.querySelector("video")!
const canvas = document.querySelector("canvas")!
const solveButton = document.getElementById(
  "solve-button"
)! as HTMLButtonElement

let model: ObjectDetection | undefined

tf.setBackend("webgl").then(async () => {
  model = await load()
  solveButton.disabled = false
})

let solving = false
let timeout: NodeJS.Timeout | undefined

async function handleSolve() {
  const results = await model!.detect(video)
  const ctx = getContext(canvas, video)

  for (const result of results) {
    drawBox(ctx, video, result)
  }

  if (solving) {
    timeout = setTimeout(handleSolve, 300)
  }
}

solveButton.addEventListener("click", () => {
  if (solving) {
    solving = false
    solveButton.innerText = "Solve"
    clearTimeout(timeout!)
  } else {
    solving = true
    solveButton.innerText = "Stop solving"
    handleSolve()
  }
})
