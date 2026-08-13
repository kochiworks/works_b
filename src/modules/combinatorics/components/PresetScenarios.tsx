import { PRESETS } from '../presets'
import type { Preset } from '../presets'
import { MODE_LABELS } from '../lib/types'

interface Props {
  onApply: (preset: Preset) => void
}

/** Quick-start example problems, framed in relatable classroom contexts rather than
 *  abstract A/B/C/D letters — a one-click way to demo each mode. */
export function PresetScenarios({ onApply }: Props) {
  return (
    <section className="panel preset-panel">
      <h2>예시 문제로 시작하기</h2>
      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="preset-card" onClick={() => onApply(preset)}>
            <span className="preset-mode-tag">{MODE_LABELS[preset.mode]}</span>
            <span className="preset-label">{preset.label}</span>
            <span className="preset-description">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
