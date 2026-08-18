export interface PredictionResult {
  label: string
  confidence: number
}

export interface AnalysisResult {
  topPrediction: PredictionResult
  predictions: PredictionResult[]
}