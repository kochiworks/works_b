import { CATEGORY_KINDS, KIND_LABELS } from '../lib/types'
import type { FunctionCategory, FunctionKind } from '../lib/types'

interface Props {
  category: FunctionCategory
  kind: FunctionKind
  onChange: (kind: FunctionKind) => void
}

export function KindSelector({ category, kind, onChange }: Props) {
  const kinds = CATEGORY_KINDS[category]
  if (kinds.length <= 1) return null

  return (
    <section className="panel">
      <h2>종류 선택</h2>
      <div className="mode-tabs">
        {kinds.map((k) => (
          <button
            key={k}
            type="button"
            className={k === kind ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(k)}
          >
            {KIND_LABELS[k]}
          </button>
        ))}
      </div>
    </section>
  )
}
