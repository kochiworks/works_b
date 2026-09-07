import { STAGE_ICONS, STAGE_LABELS } from '../lib/types'
import type { Stage } from '../lib/types'

const STAGES: Stage[] = ['build', 'relation', 'operation']

interface Props {
  stage: Stage
  onChange: (stage: Stage) => void
}

export function StageSelector({ stage, onChange }: Props) {
  return (
    <section className="panel stage-panel">
      <h2>탐구 단계</h2>
      <div className="mode-tabs">
        {STAGES.map((s, index) => (
          <button
            key={s}
            type="button"
            className={s === stage ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(s)}
          >
            <span className="stage-number">{index + 1}</span> {STAGE_ICONS[s]} {STAGE_LABELS[s]}
          </button>
        ))}
      </div>
    </section>
  )
}
