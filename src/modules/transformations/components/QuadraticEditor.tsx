import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import type { Point } from '../lib/types'

interface Props {
  a: number
  vertex: Point
  onAChange: (a: number) => void
  onVertexChange: (axis: 'x' | 'y', value: number) => void
}

export function QuadraticEditor({ a, vertex, onAChange, onVertexChange }: Props) {
  return (
    <section className="panel">
      <h2>이차함수의 표준형</h2>
      <p className="hint">
        y = {a}(x {vertex.x >= 0 ? '-' : '+'} {Math.abs(vertex.x)})² {vertex.y >= 0 ? '+' : '-'} {Math.abs(vertex.y)}
      </p>
      <div className="vertex-grid">
        <label className="param-row">
          <span>계수 a = {a}</span>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.5}
            value={a}
            onChange={(event) => onAChange(Number(event.target.value))}
          />
        </label>
        <div className="vertex-row">
          <span className="vertex-name">꼭짓점</span>
          <span className="vertex-paren">(</span>
          <input
            type="number"
            className="vertex-input"
            value={vertex.x}
            min={GRID_MIN}
            max={GRID_MAX}
            onChange={(event) => onVertexChange('x', Number(event.target.value))}
          />
          <span>,</span>
          <input
            type="number"
            className="vertex-input"
            value={vertex.y}
            min={GRID_MIN}
            max={GRID_MAX}
            onChange={(event) => onVertexChange('y', Number(event.target.value))}
          />
          <span className="vertex-paren">)</span>
        </div>
      </div>
      <p className="hint">이 도형에서는 평행이동과 x축·y축·원점 대칭만 표준형을 유지합니다.</p>
    </section>
  )
}
