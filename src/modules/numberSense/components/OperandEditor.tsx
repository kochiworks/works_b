import { effectiveOperandMax } from '../lib/operationConfigs'
import type { OperandKey, OperandValues, OperationConfig } from '../lib/types'

interface Props {
  config: OperationConfig
  values: OperandValues
  onChange: (key: OperandKey, value: number) => void
  onReset: () => void
}

/** One generic slider pair, driven by the active operation's `operands` spec —
 *  same pattern as the 함수의 그래프 module's CoefficientEditor, just fixed at
 *  exactly two sliders since every operation here is binary. */
export function OperandEditor({ config, values, onChange, onReset }: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>수 조절</h2>
        <button type="button" className="link-btn" onClick={onReset}>
          기본값으로
        </button>
      </div>
      <p className="hint">{config.description}</p>
      <div className="coefficient-list">
        {config.operands.map((spec) => {
          const value = values[spec.key]
          const max = effectiveOperandMax(config.kind, spec.key, values)
          return (
            <label key={spec.key} className="param-row">
              <span>
                {spec.label} = {value}
              </span>
              <input
                type="range"
                className="coefficient-slider"
                min={spec.min}
                max={max}
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
