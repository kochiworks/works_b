import { SHAPE_LABELS } from '../lib/types'
import type { ShapeKind } from '../lib/types'

const SHAPES: ShapeKind[] = ['point', 'segment', 'triangle', 'quad']

interface Props {
  shapeKind: ShapeKind
  onChange: (kind: ShapeKind) => void
}

export function ShapeSelector({ shapeKind, onChange }: Props) {
  return (
    <section className="panel">
      <h2>도형 선택</h2>
      <div className="mode-tabs">
        {SHAPES.map((kind) => (
          <button
            key={kind}
            type="button"
            className={kind === shapeKind ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onChange(kind)}
          >
            {SHAPE_LABELS[kind]}
          </button>
        ))}
      </div>
    </section>
  )
}
