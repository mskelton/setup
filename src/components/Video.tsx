import { css } from "@emotion/react"
import { forwardRef, MutableRefObject } from "react"
import useAsyncEffect from "use-async-effect"

const videoStyle = css`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

export const Video = forwardRef<HTMLVideoElement>(function Video(_, ref) {
  useAsyncEffect(async () => {
    try {
      const video = (ref as MutableRefObject<HTMLVideoElement>).current
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
      })

      video.srcObject = stream
    } catch (err) {
      alert(`Failed to load media ${err}`)
    }
  }, [])

  return <video ref={ref} autoPlay css={videoStyle} muted playsInline />
})
