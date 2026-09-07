import { GROUP_LABELS, OPERATIONS } from '../lib/operations'
import type { OperationEntry } from '../lib/operations'
import { Katex } from './Katex'

interface Props {
  operationId: string
  onChange: (id: string) => void
}

const GROUPS: OperationEntry['group'][] = ['basic', 'law']

/**
 * Choosing the expression also chooses how many circles the diagram needs, so
 * there is no separate two-sets/three-sets control to get out of step with it.
 */
export function OperationPicker({ operationId, onChange }: Props) {
  return (
    <section className="panel">
      <h2>연산 선택</h2>
      {GROUPS.map((group) => (
        <div key={group} className="operation-group">
          <h3 className="operation-group-title">{GROUP_LABELS[group]}</h3>
          <div className="mode-tabs">
            {OPERATIONS.filter((entry) => entry.group === group).map((entry) => (
              <button
                key={entry.id}
                type="button"
                data-op={entry.id}
                className={entry.id === operationId ? 'mode-tab active' : 'mode-tab'}
                onClick={() => onChange(entry.id)}
              >
                <Katex tex={entry.sides[0].tex} />
                {entry.setCount === 3 && <span className="set-count-badge">3집합</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
