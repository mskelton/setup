import "@tensorflow/tfjs-backend-cpu"
import "@tensorflow/tfjs-backend-webgl"
import { load, ObjectDetection } from "@tensorflow-models/coco-ssd"
import * as tf from "@tensorflow/tfjs"
import { createContext, useContext, useEffect, useState } from "react"

const ModelContext = createContext<ObjectDetection | undefined>(undefined)

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<ObjectDetection>()

  useEffect(() => {
    tf.setBackend("webgl").then(async () => {
      setModel(await load())
    })
  }, [])

  return <ModelContext.Provider value={model}>{children}</ModelContext.Provider>
}

export function useModel() {
  return useContext(ModelContext)
}
