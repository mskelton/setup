import { css } from "@emotion/react"
import { useRef } from "react"
import { Canvas } from "./components/Canvas"
import { GlobalStyles } from "./components/GlobalStyles"
import { ModelProvider } from "./components/ModelProvider"
import { Solver } from "./components/Solver"
import { Video } from "./components/Video"

const wrapperStyle = css`
  width: 80vw;
  height: 80vh;
  position: relative;
`

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  return (
    <ModelProvider>
      <GlobalStyles />

      <main>
        <div css={wrapperStyle}>
          <Video ref={videoRef} />
          <Canvas ref={canvasRef} />
        </div>

        <Solver canvasRef={canvasRef} videoRef={videoRef} />
      </main>
    </ModelProvider>
  )
}
