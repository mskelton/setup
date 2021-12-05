import { MutableRefObject, useEffect, useState } from "react"
import { drawBox, getContext } from "../utils/canvas"
import { useModel } from "./ModelProvider"

export interface SolverProps {
  videoRef: MutableRefObject<HTMLVideoElement>
  canvasRef: MutableRefObject<HTMLCanvasElement>
}

export function Solver({ canvasRef, videoRef }: SolverProps) {
  const model = useModel()
  const [solving, setSolving] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    let id: NodeJS.Timeout

    async function handleSolve() {
      const results = await model!.detect(video)
      const ctx = getContext(canvas, video)

      for (const result of results) {
        drawBox(ctx, video, result)
      }

      id = setTimeout(handleSolve, 300)
    }

    if (model && solving) {
      handleSolve()
    }

    return () => {
      getContext(canvas, video)
      clearTimeout(id)
    }
  }, [canvasRef, model, solving, videoRef])

  return (
    <button disabled={!model} onClick={() => setSolving(!solving)}>
      {solving ? "Stop solving" : "Solve"}
    </button>
  )
}
