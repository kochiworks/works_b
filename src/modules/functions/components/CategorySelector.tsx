import { CATEGORY_LABELS } from '../lib/types'
import type { FunctionCategory } from '../lib/types'

const CATEGORIES: FunctionCategory[] = ['polynomial', 'rationalIrrational', 'expLog', 'trig']

interface Props {
  category: FunctionCategory
  onChange: (category: FunctionCategory) => void
}

export function CategorySelector({ category, onChange }: Props) {
  return (
    <section className="panel">
      <h2>함수 분류</h2>
      <div className="mode-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={c === category ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(c)}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
    </section>
  )
}
