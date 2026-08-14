import { EXPERIMENT_DESCRIPTIONS, EXPERIMENT_LABELS } from '../lib/types'
import type { ExperimentKind } from '../lib/types'

const KINDS: ExperimentKind[] = ['coin', 'dice', 'ball']

interface Props {
  kind: ExperimentKind
  onChange: (kind: ExperimentKind) => void
}

export function ExperimentSelector({ kind, onChange }: Props) {
  return (
    <section className="panel">
      <h2>실험 선택</h2>
      <div className="mode-tabs">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            className={k === kind ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(k)}
          >
            {EXPERIMENT_LABELS[k]}
          </button>
        ))}
      </div>
      <p className="hint">{EXPERIMENT_DESCRIPTIONS[kind]}</p>
    </section>
  )
}
