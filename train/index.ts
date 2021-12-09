import * as tf from "@tensorflow/tfjs-node"
import { loadImages } from "./files"
import { getModel } from "./model"

async function main() {
  // const [X, Y] = await loadImages()
  const model = await getModel()

  // // Train
  // await model.fit(X, Y, {
  //   batchSize: 256,
  //   epochs: 20,
  //   shuffle: true,
  //   validationSplit: 0.1,
  // })

  // model.save("file://model_result/sorting_hat")
  // tf.dispose([X, Y, model])
}

main().catch(console.error)
