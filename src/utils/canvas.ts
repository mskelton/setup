import { DetectedObject } from "@tensorflow-models/coco-ssd"

export function getContext(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  canvas.width = video.clientWidth
  canvas.height = video.clientHeight

  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  return ctx
}

export function drawBox(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  obj: DetectedObject
) {
  ctx.strokeStyle = "#0F0"
  ctx.fillStyle = "#0F0"
  ctx.lineWidth = 1

  const box = obj.bbox
  const scaleX = video.clientWidth / video.videoWidth
  const scaleY = video.clientHeight / video.videoHeight

  const startX = box[0] * scaleX
  const startY = box[1] * scaleY
  const width = (box[2] - box[0]) * scaleX
  const height = (box[3] - box[1]) * scaleY

  ctx.strokeRect(startX, startY, width, height)
  ctx.fillText(
    obj.score.toFixed(3) + " " + obj.class,
    startX,
    startY > 10 ? startY - 5 : 10
  )
}
