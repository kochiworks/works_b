import { useEffect, useState } from 'react'
import { effectiveOperandMax } from '../lib/operationConfigs'
import type { OperandKey, OperandSpec, OperandValues, OperationConfig } from '../lib/types'

interface Props {
  config: OperationConfig
  values: OperandValues
  onChange: (key: OperandKey, value: number) => void
  onReset: () => void
}

/** One generic number-input pair, driven by the active operation's `operands`
 *  spec. Values here range up to 999, where a drag-slider makes it hard to
 *  land on an exact number — a keyboard-editable field is the more usable
 *  fit, unlike the smaller ranges (-10..10 or so) the other modules' sliders
 *  cover well. */
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
        {config.operands.map((spec) => (
          <OperandField
            key={spec.key}
            spec={spec}
            value={values[spec.key]}
            max={effectiveOperandMax(config.kind, spec.key, values)}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  )
}

interface FieldProps {
  spec: OperandSpec
  value: number
  max: number
  onChange: (key: OperandKey, value: number) => void
}

/** Keeps its own draft text while the student is typing — committing (and
 *  letting the parent's sanitizeOperandPair clamp it) only on blur or Enter,
 *  rather than re-clamping after every keystroke, which would fight the
 *  student mid-type (e.g. clamping "9" down before they can finish "99"). */
function OperandField({ spec, value, max, onChange }: FieldProps) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  const commit = () => {
    const parsed = Number(text)
    if (text.trim() !== '' && Number.isFinite(parsed)) {
      // Clamp here too, matching the parent's sanitizeOperandPair, and sync
      // `text` to the clamped result immediately — if the clamped value
      // happens to equal what the field already held (e.g. typing "999" for
      // 뺄셈's b when it was already sitting at its max, a), the `value` prop
      // never changes, so the effect below never fires to correct a stale
      // draft on its own.
      const stepped = Math.round(parsed / spec.step) * spec.step
      const clamped = Math.min(Math.max(stepped, spec.min), max)
      onChange(spec.key, clamped)
      setText(String(clamped))
    } else {
      setText(String(value))
    }
  }

  return (
    <label className="param-row">
      <span>{spec.label}</span>
      <input
        type="number"
        inputMode="numeric"
        className="operand-number-input"
        min={spec.min}
        max={max}
        step={spec.step}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commit()
            event.currentTarget.blur()
          }
        }}
      />
    </label>
  )
}
