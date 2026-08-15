import { PRESETS } from '../presets'
import type { Preset } from '../presets'

interface Props {
  onApply: (preset: Preset) => void
}

export function PresetScenarios({ onApply }: Props) {
  return (
    <section className="panel preset-panel">
      <h2>예시 문제로 시작하기</h2>
      <div className="preset-grid">
        {PRESETS.map((preset) => (
          <button key={preset.id} type="button" className="preset-card" onClick={() => onApply(preset)}>
            <span className="preset-label">{preset.label}</span>
            <span className="preset-description">{preset.description}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
