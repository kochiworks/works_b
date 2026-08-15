import { Katex } from './Katex'
import type { OperandValues, OperationConfig, OperationOutcome } from '../lib/types'

interface Props {
  config: OperationConfig
  values: OperandValues
  outcome: OperationOutcome
}

export function EquationDisplay({ config, values, outcome }: Props) {
  return (
    <div className="formula-card">
      <div className="formula-row">
        <Katex tex={config.equationTex(values.a, values.b, outcome)} className="formula-expression--large" />
      </div>
    </div>
  )
}
