import { css } from "@emotion/react"
import { forwardRef } from "react"

const canvasStyle = css`
  top: 0;
  left: 0;
  position: absolute;
`

export const Canvas = forwardRef<HTMLCanvasElement>(function Canvas(_, ref) {
  return <canvas ref={ref} css={canvasStyle} />
})
