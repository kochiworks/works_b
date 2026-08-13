import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import { VERTEX_NAMES } from '../lib/types'
import type { Point } from '../lib/types'

interface Props {
  points: Point[]
  onChange: (index: number, axis: 'x' | 'y', value: number) => void
}

export function VertexEditor({ points, onChange }: Props) {
  return (
    <section className="panel">
      <h2>꼭짓점 좌표</h2>
      <div className="vertex-grid">
        {points.map((p, i) => (
          <div key={i} className="vertex-row">
            <span className="vertex-name">{VERTEX_NAMES[i]}</span>
            <span className="vertex-paren">(</span>
            <input
              type="number"
              className="vertex-input"
              value={p.x}
              min={GRID_MIN}
              max={GRID_MAX}
              onChange={(event) => onChange(i, 'x', Number(event.target.value))}
            />
            <span>,</span>
            <input
              type="number"
              className="vertex-input"
              value={p.y}
              min={GRID_MIN}
              max={GRID_MAX}
              onChange={(event) => onChange(i, 'y', Number(event.target.value))}
            />
            <span className="vertex-paren">)</span>
          </div>
        ))}
      </div>
      <p className="hint">
        좌표는 {GRID_MIN}~{GRID_MAX} 사이에서 정할 수 있습니다.
      </p>
    </section>
  )
}
