import { formulaBreakdown } from '../lib/formulas'
import type { Mode } from '../lib/types'

interface Props {
  mode: Mode
  n: number
  r: number
}

/** Shows the textbook symbol (₅P₃ style) and the arithmetic behind it, for tying the
 *  simulation back to the notation students see on the board / in the textbook. */
export function FormulaDisplay({ mode, n, r }: Props) {
  const { symbol, expression, value } = formulaBreakdown(mode, n, r)

  return (
    <div className="formula-card">
      <span className="formula-notation">
        <sub>{n}</sub>
        <span className="formula-symbol">{symbol}</span>
        <sub>{r}</sub>
      </span>
      <span className="formula-eq">=</span>
      <span className="formula-expression">{expression}</span>
      <span className="formula-eq">=</span>
      <span className="formula-value">{value.toLocaleString('ko-KR')}</span>
    </div>
  )
}
