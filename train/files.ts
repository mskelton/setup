import * as tf from "@tensorflow/tfjs-node"
import * as fs from "fs/promises"
import * as path from "path"
import * as dfd from "danfojs-node"

export async function loadImages() {
  const labelsPath = path.join(__dirname, "data/labels.csv")
  const df = await dfd.read_csv(labelsPath, {})
  const images: tf.Tensor3D[] = []

  for await (const filename of df.column("File").values) {
    const imagePath = path.join(__dirname, "data/images", filename as string)
    const image = await fs.readFile(imagePath)
    const tensor = tf.node.decodeImage(image, 3) as tf.Tensor3D

    images.push(tensor)
  }

  // Don't need the file column anymore
  df.drop({ columns: ["File"], inplace: true })

  return tf.tidy(() => {
    const Y = df.tensor
    const X = tf.stack(images).resizeBilinear([224, 224])

    return [X, Y]
  })
}
