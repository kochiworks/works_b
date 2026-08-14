interface Props {
  slope: number
  intercept: number
  onSlopeChange: (slope: number) => void
  onInterceptChange: (intercept: number) => void
}

export function LineEditor({ slope, intercept, onSlopeChange, onInterceptChange }: Props) {
  return (
    <section className="panel">
      <h2>직선의 방정식</h2>
      <p className="hint">y = {slope}x {intercept >= 0 ? '+' : '-'} {Math.abs(intercept)}</p>
      <div className="vertex-grid">
        <label className="param-row">
          <span>기울기 a = {slope}</span>
          <input
            type="range"
            min={-4}
            max={4}
            step={0.5}
            value={slope}
            onChange={(event) => onSlopeChange(Number(event.target.value))}
          />
        </label>
        <label className="param-row">
          <span>y절편 b = {intercept}</span>
          <input
            type="range"
            min={-8}
            max={8}
            value={intercept}
            onChange={(event) => onInterceptChange(Number(event.target.value))}
          />
        </label>
      </div>
    </section>
  )
}
