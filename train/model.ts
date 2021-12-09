import * as tf from "@tensorflow/tfjs-node"

const modelURL = `https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/4`

export async function getModel() {
  const featureModel = await tf.loadGraphModel(modelURL, { fromTFHub: true })

  // const lastLayer = featureModel.getLayer("conv_pw_13_relu")
  // const shavedModel = tf.model({
  //   inputs: featureModel.inputs,
  //   outputs: lastLayer.output,
  // })

  // console.log("Creating features from images - this may take a while...")
  // const featureX = shavedModel.predict(chessTensor)

  // // Create NN
  // const transferModel = tf.sequential({
  //   layers: [
  //     tf.layers.flatten({ inputShape: featureX.shape.slice(1) }),
  //     tf.layers.dense({ activation: "relu", units: 64 }),
  //     // Final layer sigmod true/false for each trait
  //     tf.layers.dense({ activation: "sigmoid", units: 12 }),
  //   ],
  // })

  // transferModel.compile({
  //   loss: "categoricalCrossentropy",
  //   metrics: ["accuracy"],
  //   optimizer: "adam",
  // })

  // await transferModel.fit(featureX, Y, {
  //   callbacks: { onEpochEnd: console.log },
  //   epochs: 10,
  //   validationSplit: 0.2,
  // })

  // // Combine the models
  // const combo = tf.sequential()

  // combo.add(shavedModel)
  // combo.add(transferModel)
  // combo.compile({
  //   loss: "categoricalCrossentropy",
  //   metrics: ["accuracy"],
  //   optimizer: "adam",
  // })

  // return combo
}
