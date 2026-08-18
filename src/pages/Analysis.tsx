import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Activity,
  Upload,
  ArrowLeft,
  FileImage,
  Brain,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react"
import { analyzeImage } from "../services/modelService"

const CLASS_LABELS = [
  "Normal",
  "Pneumonia",
]

export default function Analysis() {
  const navigate = useNavigate()

  const [image, setImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [predictions, setPredictions] =
    useState<number[]>([])

  const handleImage = (file: File) => {
    setSelectedFile(file)

    const url = URL.createObjectURL(file)

    setImage(url)

    setResult(false)
    setError(null)
    setPredictions([])
  }

  const analyze = async () => {
    if (!selectedFile) {
      setError("Please upload an image first.")
      return
    }

    setAnalyzing(true)
    setResult(false)
    setError(null)

    try {
     const output = await analyzeImage(
  selectedFile
)

console.log(
  "ONNX model output:",
  output
)

setPredictions(output)
setResult(true)


// =========================
// SAVE ANALYSIS HISTORY
// =========================

const normalProbability =
  output[0] * 100

const pneumoniaProbability =
  output[1] * 100

const predictedClass =
  output.indexOf(
    Math.max(...output)
  )

const predictedLabel =
  predictedClass === 0
    ? "Normal"
    : "Pneumonia"

const confidence =
  output[predictedClass] * 100

const newRecord = {
  id: Date.now().toString(),

  prediction: predictedLabel,

  confidence: confidence,

  normalProbability:
    normalProbability,

  pneumoniaProbability:
    pneumoniaProbability,

  timestamp:
    new Date().toISOString(),
}

const existingHistory =
  localStorage.getItem(
    "medical-ai-history"
  )

let history = []

if (existingHistory) {

  try {

    history =
      JSON.parse(existingHistory)

  } catch {

    history = []

  }

}

history.unshift(newRecord)

// Keep the latest 20 analyses
history = history.slice(0, 20)

localStorage.setItem(
  "medical-ai-history",
  JSON.stringify(history)
)

console.log(
  "Analysis saved to history:",
  newRecord
)

    } catch (err) {
      console.error(
        "AI analysis failed:",
        err
      )

      setError(
        "The AI model could not analyze this image. Check the browser console for details."
      )

    } finally {
      setAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setImage(null)
    setSelectedFile(null)
    setPredictions([])
    setResult(false)
    setError(null)
  }

  const normalProbability =
    predictions.length >= 2
      ? predictions[0] * 100
      : 0

  const pneumoniaProbability =
    predictions.length >= 2
      ? predictions[1] * 100
      : 0

  const predictedClass =
    predictions.length >= 2
      ? predictions.indexOf(
          Math.max(...predictions)
        )
      : -1

  const predictedLabel =
    predictedClass >= 0
      ? CLASS_LABELS[predictedClass]
      : ""

  const confidence =
    predictedClass >= 0
      ? predictions[predictedClass] * 100
      : 0

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVIGATION */}

      <nav className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center px-6 py-5">

          <button
            onClick={() => navigate("/")}
            className="mr-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-600 p-2">
              <Activity size={20} />
            </div>

            <div>
              <span className="text-xl font-bold">
                Medical Image Analysis
              </span>

              <p className="text-xs text-slate-500">
                AI-assisted chest X-ray classification
              </p>
            </div>

          </div>

        </div>

      </nav>

      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

            <Brain size={16} />

            AI Analysis

          </div>

          <h1 className="text-4xl font-bold tracking-tight">

            Analyze Medical Image

          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">

            Upload a chest X-ray and allow the trained
            AI model to classify the image as Normal
            or Pneumonia.

          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* IMAGE UPLOAD */}

          <section>

            <div className="mb-4 flex items-center gap-3">

              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">

                <Upload size={20} />

              </div>

              <div>

                <h2 className="font-semibold">
                  X-ray Image
                </h2>

                <p className="text-sm text-slate-500">
                  Upload an image to begin
                </p>

              </div>

            </div>

            <label
              htmlFor="image-upload"
              className="flex min-h-[440px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900 p-8 text-center transition hover:border-blue-500 hover:bg-slate-900/80"
            >

              {image ? (

                <img
                  src={image}
                  alt="Uploaded chest X-ray"
                  className="max-h-[390px] max-w-full rounded-2xl object-contain"
                />

              ) : (

                <>

                  <div className="rounded-2xl bg-blue-500/10 p-6 text-blue-400">

                    <FileImage size={44} />

                  </div>

                  <h3 className="mt-6 text-xl font-semibold">

                    Upload Chest X-ray

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Drag and drop or click to browse

                  </p>

                  <p className="mt-3 text-xs text-slate-600">

                    PNG, JPG or JPEG

                  </p>

                </>

              )}

              <input
                id="image-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(event) => {

                  const file =
                    event.target.files?.[0]

                  if (file) {
                    handleImage(file)
                  }

                }}
              />

            </label>

            {image && !result && (

              <button
                onClick={analyze}
                disabled={analyzing}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Brain size={20} />

                {analyzing
                  ? "AI Analyzing..."
                  : "Analyze X-ray"}

              </button>

            )}

            {image && result && (

              <button
                onClick={resetAnalysis}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-4 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >

                <RotateCcw size={19} />

                Analyze Another Image

              </button>

            )}

            {error && (

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">

                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>

              </div>

            )}

          </section>

          {/* RESULTS */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">

              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">

                <FileImage size={20} />

              </div>

              <div>

                <h2 className="font-semibold">
                  Analysis Results
                </h2>

                <p className="text-sm text-slate-500">
                  Model prediction and probabilities
                </p>

              </div>

            </div>

            {/* EMPTY STATE */}

            {!result && !analyzing && (

              <div className="flex min-h-[500px] items-center justify-center text-center">

                <div className="max-w-sm">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">

                    <Brain
                      size={38}
                      className="text-slate-600"
                    />

                  </div>

                  <h3 className="mt-6 text-xl font-semibold">

                    Ready for Analysis

                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">

                    Upload a chest X-ray on the left
                    and run the AI model to receive
                    a classification.

                  </p>

                </div>

              </div>

            )}

            {/* ANALYZING */}

            {analyzing && (

              <div className="flex min-h-[500px] items-center justify-center text-center">

                <div>

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/10">

                    <Brain
                      size={40}
                      className="animate-pulse text-blue-400"
                    />

                  </div>

                  <h3 className="mt-6 text-xl font-semibold">

                    Running AI Model

                  </h3>

                  <p className="mt-3 text-sm text-slate-500">

                    Processing the X-ray in your browser...

                  </p>

                  <div className="mx-auto mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">

                    <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-500" />

                  </div>

                </div>

              </div>

            )}

            {/* RESULTS */}

            {result && (

              <div className="pt-7">

                {/* STATUS */}

                <div className="flex items-center gap-2 text-emerald-400">

                  <CheckCircle2 size={20} />

                  <span className="text-sm font-semibold">

                    Analysis Complete

                  </span>

                </div>

                {/* PREDICTION */}

                <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-950 p-6">

                  <p className="text-sm text-slate-500">

                    Predicted Classification

                  </p>

                  <h3 className="mt-2 text-4xl font-bold">

                    {predictedLabel}

                  </h3>

                  <p className="mt-2 text-sm text-slate-500">

                    Model confidence

                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-400">

                    {confidence.toFixed(2)}%

                  </p>

                </div>

                {/* PROBABILITIES */}

                <div className="mt-7">

                  <div className="mb-5">

                    <h3 className="font-semibold">

                      Class Probabilities

                    </h3>

                    <p className="mt-1 text-sm text-slate-500">

                      Probability assigned to each class
                      by the AI model.

                    </p>

                  </div>

                  {/* NORMAL */}

                  <div className="mb-6">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-medium">

                        Normal

                      </span>

                      <span className="text-sm font-semibold text-slate-300">

                        {normalProbability.toFixed(2)}%

                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-slate-400 transition-all duration-700"
                        style={{
                          width: `${normalProbability}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* PNEUMONIA */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-medium">

                        Pneumonia

                      </span>

                      <span className="text-sm font-semibold text-blue-400">

                        {pneumoniaProbability.toFixed(2)}%

                      </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-blue-500 transition-all duration-700"
                        style={{
                          width: `${pneumoniaProbability}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

                {/* MODEL INFORMATION */}

                <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

                  <div className="flex items-center gap-2 text-blue-400">

                    <Brain size={18} />

                    <p className="font-semibold">

                      Model Information

                    </p>

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">

                    <div>

                      <p className="text-slate-500">
                        Architecture
                      </p>

                      <p className="mt-1 font-medium">
                        ResNet18
                      </p>

                    </div>

                    <div>

                      <p className="text-slate-500">
                        Runtime
                      </p>

                      <p className="mt-1 font-medium">
                        ONNX Runtime Web
                      </p>

                    </div>

                    <div>

                      <p className="text-slate-500">
                        Classes
                      </p>

                      <p className="mt-1 font-medium">
                        2
                      </p>

                    </div>

                    <div>

                      <p className="text-slate-500">
                        Test Accuracy
                      </p>

                      <p className="mt-1 font-medium">
                        88.78%
                      </p>

                    </div>

                  </div>

                </div>

                {/* DISCLAIMER */}

                <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">

                  <div className="flex gap-3">

                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-400"
                    />

                    <div>

                      <p className="font-semibold text-amber-400">

                        Important Notice

                      </p>

                      <p className="mt-2 text-xs leading-5 text-amber-200/70">

                        This application is an AI
                        research prototype. Its output
                        is not a medical diagnosis and
                        must not replace assessment by
                        a qualified healthcare professional.

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            )}

          </section>

        </div>

      </main>

    </div>
  )
}