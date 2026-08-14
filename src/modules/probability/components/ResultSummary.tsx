interface Props {
  revealed: number
  hits: number
  theoreticalProbability: number
}

export function ResultSummary({ revealed, hits, theoreticalProbability }: Props) {
  const relativeFrequency = revealed > 0 ? hits / revealed : null
  const diff = relativeFrequency !== null ? Math.abs(relativeFrequency - theoreticalProbability) : null

  return (
    <section className="panel result-summary">
      <div className="totals-row">
        <div className="total-figure">
          <span className="total-label">지금까지 시행</span>
          <span className="total-number">{revealed.toLocaleString('ko-KR')}번</span>
        </div>
        <div className="total-figure">
          <span className="total-label">사건 A 발생</span>
          <span className="total-number">{hits.toLocaleString('ko-KR')}번</span>
        </div>
        <div className="total-figure total-figure--conditioned">
          <span className="total-label">상대도수 (실험적 확률)</span>
          <span className="total-number">{relativeFrequency !== null ? relativeFrequency.toFixed(3) : '—'}</span>
        </div>
      </div>
      {diff !== null && (
        <p className="hint">이론적 확률과의 차이: ±{diff.toFixed(3)} — 시행 횟수가 늘어날수록 이 차이가 점점 줄어듭니다.</p>
      )}
    </section>
  )
}
