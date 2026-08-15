interface Props {
  lines: string[]
}

/** 가로셈 — the same calculation written as a growing list of per-자리
 *  sentences instead of aligned columns. Plain text rather than KaTeX: these
 *  are Korean narration sentences with numbers embedded in them ("일의 자리:
 *  4 + 8 = 12 → …"), not clean math expressions, so KaTeX (which can't set
 *  Hangul) isn't the right tool here — that's reserved for the single
 *  summary equation shown above in EquationDisplay. */
export function HorizontalAlgorithm({ lines }: Props) {
  if (lines.length === 0) {
    return <p className="horizontal-empty">계산이 시작되면 여기에 자리별 가로셈이 한 줄씩 나타나요.</p>
  }
  return (
    <ol className="horizontal-lines">
      {lines.map((line, index) => (
        <li key={index} className={index === lines.length - 1 ? 'horizontal-line is-latest' : 'horizontal-line'}>
          {line}
        </li>
      ))}
    </ol>
  )
}
