import { Katex } from './Katex'
import type { CoefficientValues, FunctionKindConfig } from '../lib/types'

interface Props {
  config: FunctionKindConfig
  values: CoefficientValues
}

/** The current equation in textbook notation, plus a short domain/range/asymptote
 *  summary — ties the slider positions back to what students would write on paper. */
export function EquationDisplay({ config, values }: Props) {
  return (
    <div className="formula-card">
      <div className="formula-row">
        <Katex tex={config.equationText(values)} className="formula-expression--large" />
      </div>
      <p className="hint">{config.featuresText(values)}</p>
    </div>
  )
}
