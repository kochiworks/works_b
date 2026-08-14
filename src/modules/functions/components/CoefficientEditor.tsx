import type { CoefficientValues, FunctionKindConfig } from '../lib/types'

interface Props {
  config: FunctionKindConfig
  values: CoefficientValues
  onChange: (key: 'a' | 'b' | 'p' | 'q', value: number) => void
  onReset: () => void
}

/** One generic slider list, driven entirely by the active function kind's
 *  `coefficients` spec — this is what lets 11 different function kinds share a
 *  single editor component instead of needing one hand-built editor apiece. */
export function CoefficientEditor({ config, values, onChange, onReset }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>계수 조절</h2>
        <button type="button" className="link-btn" onClick={onReset}>
          기본값으로
        </button>
      </div>
      <div className="coefficient-list">
        {config.coefficients.map((spec) => {
          const value = values[spec.key] ?? spec.default
          return (
            <label key={spec.key} className="param-row">
              <span>
                {spec.label} = {value}
              </span>
              <input
                type="range"
                className="coefficient-slider"
                min={spec.min}
                max={spec.max}
                step={spec.step}
                value={value}
                onChange={(event) => onChange(spec.key, Number(event.target.value))}
              />
            </label>
          )
        })}
      </div>
    </section>
  )
}
