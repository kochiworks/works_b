import { OPERATION_ICONS, OPERATION_LABELS } from '../lib/types'
import type { OperationKind } from '../lib/types'

const OPERATIONS: OperationKind[] = ['addition', 'subtraction', 'multiplication', 'division']

interface Props {
  kind: OperationKind
  onChange: (kind: OperationKind) => void
}

export function OperationSelector({ kind, onChange }: Props) {
  return (
    <section className="panel">
      <h2>연산 선택</h2>
      <div className="mode-tabs">
        {OPERATIONS.map((k) => (
          <button
            key={k}
            type="button"
            className={k === kind ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(k)}
          >
            {OPERATION_ICONS[k]} {OPERATION_LABELS[k]}
          </button>
        ))}
      </div>
    </section>
  )
}
