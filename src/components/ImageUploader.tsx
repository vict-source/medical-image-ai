import { useState } from "react"
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react"
import { analyzeImage } from "../services/modelService"
import type { AnalysisResult } from "../types/medical"

interface ImageUploaderProps {
  onAnalysisComplete: (result: AnalysisResult, file: File) => void
}

export default function ImageUploader({
  onAnalysisComplete,
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid medical image.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const result = await analyzeImage(file)
      onAnalysisComplete(result, file)
    } catch (err) {
      console.error(err)
      setError(
        "Unable to analyze this image. Check that the ONNX model is available."
      )
    } finally {
      setLoading(false)
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (file) {
      handleFile(file)
    }
  }

  return (
    <div className="w-full">
      <label
        htmlFor="medical-image"
        className="group flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center transition hover:border-blue-500 hover:bg-blue-50/30"
      >
        {loading ? (
          <>
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-600" />

            <h3 className="text-lg font-semibold text-slate-900">
              Analyzing image
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Running the AI model in your browser...
            </p>
          </>
        ) : (
          <>
            <div className="mb-5 rounded-full bg-blue-100 p-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Upload Chest X-ray
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Select a chest X-ray image for AI-assisted analysis.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              <ImageIcon className="h-4 w-4" />
              Choose image
            </div>
          </>
        )}

        <input
          id="medical-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={loading}
        />
      </label>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}