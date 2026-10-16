import * as ort from "onnxruntime-web"
import type { AnalysisResult, PredictionResult } from "../types/medical"

let session: ort.InferenceSession | null = null

const MODEL_PATH = "/models/chest_xray.onnx"

export const CLASS_LABELS = [
  "Normal",
  "Pneumonia",
]

async function loadModel(): Promise<ort.InferenceSession> {
  if (session) return session

  console.log("Loading ONNX model...")

  session = await ort.InferenceSession.create(MODEL_PATH)

  console.log("ONNX model loaded successfully")
  console.log("Input:", session.inputNames)
  console.log("Output:", session.outputNames)

  return session
}

async function imageToTensor(file: File): Promise<ort.Tensor> {
  const image = await createImageBitmap(file)
  const canvas = document.createElement("canvas")

  canvas.width = 224
  canvas.height = 224

  const context = canvas.getContext("2d")

  if (!context) {
    image.close()
    throw new Error("Unable to create image canvas")
  }

  try {
    context.drawImage(image, 0, 0, 224, 224)

    const imageData = context.getImageData(0, 0, 224, 224)
    const pixelCount = 224 * 224
    const input = new Float32Array(3 * pixelCount)

    const mean = [0.485, 0.456, 0.406]
    const std = [0.229, 0.224, 0.225]

    for (let i = 0; i < pixelCount; i++) {
      const offset = i * 4

      const r = imageData.data[offset] / 255
      const g = imageData.data[offset + 1] / 255
      const b = imageData.data[offset + 2] / 255

      input[i] = (r - mean[0]) / std[0]
      input[pixelCount + i] = (g - mean[1]) / std[1]
      input[2 * pixelCount + i] = (b - mean[2]) / std[2]
    }

    return new ort.Tensor("float32", input, [1, 3, 224, 224])
  } finally {
    image.close()
  }
}

function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits)

  const exponentials = logits.map(
    value => Math.exp(value - maxLogit)
  )

  const sum = exponentials.reduce(
    (total, value) => total + value,
    0
  )

  return exponentials.map(value => value / sum)
}

export async function analyzeImage(
  file: File
): Promise<AnalysisResult> {
  const model = await loadModel()
  const tensor = await imageToTensor(file)

  const inputName = model.inputNames[0]

  const output = await model.run({
    [inputName]: tensor,
  })

  const outputName = model.outputNames[0]
  const result = output[outputName]

  const logits = Array.from(result.data as Float32Array)
  const probabilities = softmax(logits)

  if (probabilities.length !== CLASS_LABELS.length) {
    throw new Error(
      `Expected ${CLASS_LABELS.length} class scores, received ${probabilities.length}.`
    )
  }

  const predictions: PredictionResult[] = CLASS_LABELS.map(
    (label, index) => ({
      label,
      confidence: probabilities[index],
    })
  ).sort((a, b) => b.confidence - a.confidence)

  return {
    topPrediction: predictions[0],
    predictions,
  }
}