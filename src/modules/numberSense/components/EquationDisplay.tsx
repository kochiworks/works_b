import { Katex } from './Katex'
import type { OperandValues, OperationConfig, OperationResult } from '../lib/types'

interface Props {
  config: OperationConfig
  values: OperandValues
  result: OperationResult
}

/** The current calculation in textbook notation, plus a short principle
 *  explanation — ties the operand sliders back to what a student would say
 *  out loud while working the beads. */
export function EquationDisplay({ config, values, result }: Props) {
  return (
    <div className="formula-card">
      <div className="formula-row">
        <Katex tex={config.equationTex(values.a, values.b, result)} className="formula-expression--large" />
      </div>
      <p className="hint">{config.principleText(values.a, values.b, result)}</p>
    </div>
  )
}
