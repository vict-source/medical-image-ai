interface PredictionCardProps {
  labels: string[]
  values: number[]
}

export default function PredictionCard({
  labels,
  values,
}: PredictionCardProps) {
  if (!values.length) return null

  const maxIndex = values.reduce(
    (best, value, index) =>
      value > values[best] ? index : best,
    0
  )

  const prediction = labels[maxIndex]
  const confidence = values[maxIndex]

  return (
    <div className="prediction-card">
      <div className="prediction-card-header">
        <span>AI PREDICTION</span>
        <span className="prediction-status">Complete</span>
      </div>

      <div className="prediction-main">
        <div>
          <p className="prediction-label">Most likely classification</p>

          <h2>{prediction}</h2>
        </div>

        <div className="confidence-value">
          {(confidence * 100).toFixed(1)}%
        </div>
      </div>

      <div className="confidence-bar">
        <div
          className="confidence-fill"
          style={{
            width: `${Math.min(confidence * 100, 100)}%`,
          }}
        />
      </div>

      <p className="prediction-note">
        AI-generated classification based on the uploaded image.
      </p>
    </div>
  )
}