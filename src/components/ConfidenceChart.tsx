interface ConfidenceChartProps {
  labels: string[]
  values: number[]
}

export default function ConfidenceChart({
  labels,
  values,
}: ConfidenceChartProps) {
  return (
    <div className="confidence-chart">
      <div className="chart-heading">
        <div>
          <h3>Classification Confidence</h3>
          <p>Model probability distribution</p>
        </div>
      </div>

      <div className="confidence-list">
        {labels.map((label, index) => {
          const value = values[index] ?? 0
          const percentage = value * 100

          return (
            <div className="confidence-row" key={label}>
              <div className="confidence-row-top">
                <span>{label}</span>
                <strong>{percentage.toFixed(1)}%</strong>
              </div>

              <div className="confidence-track">
                <div
                  className="confidence-progress"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}