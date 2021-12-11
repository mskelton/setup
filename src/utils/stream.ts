export async function setupStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
      },
    })

    document.querySelector("video")!.srcObject = stream
  } catch (err) {
    alert(`Failed to load media ${err}`)
  }
}

setupStream()
