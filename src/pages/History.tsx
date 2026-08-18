import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Activity,
  ArrowLeft,
  FileImage,
  Trash2,
  Brain,
  Clock,
  BarChart3,
} from "lucide-react"

interface AnalysisRecord {
  id: string
  prediction: string
  confidence: number
  normalProbability: number
  pneumoniaProbability: number
  timestamp: string
}

export default function History() {
  const navigate = useNavigate()

  const [history, setHistory] =
    useState<AnalysisRecord[]>([])

  useEffect(() => {
    const savedHistory =
      localStorage.getItem(
        "medical-ai-history"
      )

    if (savedHistory) {
      try {
        setHistory(
          JSON.parse(savedHistory)
        )
      } catch {
        console.error(
          "Unable to read analysis history."
        )
      }
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem(
      "medical-ai-history"
    )

    setHistory([])
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVIGATION */}

      <nav className="border-b border-slate-800">

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

            <span className="text-xl font-bold">
              Analysis History
            </span>

          </div>

        </div>

      </nav>


      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-6 py-12">

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

              <Clock size={15} />

              Previous Analyses

            </div>

            <h1 className="text-3xl font-bold">

              Analysis History

            </h1>

            <p className="mt-2 text-slate-400">

              Review your previous AI-assisted
              chest X-ray classifications.

            </p>

          </div>


          {history.length > 0 && (

            <button
              onClick={clearHistory}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >

              <Trash2 size={17} />

              Clear History

            </button>

          )}

        </div>


        {/* EMPTY STATE */}

        {history.length === 0 && (

          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-800">

              <FileImage
                size={40}
                className="text-slate-600"
              />

            </div>

            <h2 className="mt-6 text-xl font-semibold">

              No analyses yet

            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">

              Your completed chest X-ray analyses
              will appear here.

            </p>

            <button
              onClick={() => navigate("/analysis")}
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >

              Start Analysis

            </button>

          </div>

        )}


        {/* HISTORY LIST */}

        {history.length > 0 && (

          <div className="mt-10 space-y-5">

            {history.map((item) => (

              <div
                key={item.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >

                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                  {/* RESULT */}

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">

                      <Brain size={24} />

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">
                        Classification
                      </p>

                      <h3 className="mt-1 text-xl font-bold">

                        {item.prediction}

                      </h3>

                    </div>

                  </div>


                  {/* CONFIDENCE */}

                  <div>

                    <p className="text-sm text-slate-500">
                      Confidence
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-400">

                      {item.confidence.toFixed(2)}%

                    </p>

                  </div>


                  {/* DATE */}

                  <div>

                    <p className="text-sm text-slate-500">
                      Date
                    </p>

                    <p className="mt-1 text-sm text-slate-300">

                      {new Date(
                        item.timestamp
                      ).toLocaleString()}

                    </p>

                  </div>

                </div>


                {/* PROBABILITY DETAILS */}

                <div className="mt-6 border-t border-slate-800 pt-5">

                  <div className="mb-4 flex items-center gap-2">

                    <BarChart3
                      size={17}
                      className="text-slate-500"
                    />

                    <span className="text-sm font-medium text-slate-400">

                      Probability Distribution

                    </span>

                  </div>


                  {/* NORMAL */}

                  <div className="mb-4">

                    <div className="mb-2 flex justify-between text-sm">

                      <span className="text-slate-400">
                        Normal
                      </span>

                      <span className="text-slate-300">

                        {item.normalProbability.toFixed(2)}%

                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-slate-500"
                        style={{
                          width: `${item.normalProbability}%`,
                        }}
                      />

                    </div>

                  </div>


                  {/* PNEUMONIA */}

                  <div>

                    <div className="mb-2 flex justify-between text-sm">

                      <span className="text-slate-400">
                        Pneumonia
                      </span>

                      <span className="text-blue-400">

                        {item.pneumoniaProbability.toFixed(2)}%

                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${item.pneumoniaProbability}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}