import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import type { Point } from '../lib/types'

interface Props {
  center: Point
  radius: number
  onCenterChange: (axis: 'x' | 'y', value: number) => void
  onRadiusChange: (radius: number) => void
}

export function CircleEditor({ center, radius, onCenterChange, onRadiusChange }: Props) {
  return (
    <section className="panel">
      <h2>원의 방정식</h2>
      <p className="hint">
        (x {center.x >= 0 ? '-' : '+'} {Math.abs(center.x)})² + (y {center.y >= 0 ? '-' : '+'} {Math.abs(center.y)})² ={' '}
        {radius}²
      </p>
      <div className="vertex-grid">
        <div className="vertex-row">
          <span className="vertex-name">중심</span>
          <span className="vertex-paren">(</span>
          <input
            type="number"
            className="vertex-input"
            value={center.x}
            min={GRID_MIN}
            max={GRID_MAX}
            onChange={(event) => onCenterChange('x', Number(event.target.value))}
          />
          <span>,</span>
          <input
            type="number"
            className="vertex-input"
            value={center.y}
            min={GRID_MIN}
            max={GRID_MAX}
            onChange={(event) => onCenterChange('y', Number(event.target.value))}
          />
          <span className="vertex-paren">)</span>
        </div>
        <label className="param-row">
          <span>반지름 r = {radius}</span>
          <input
            type="range"
            min={1}
            max={6}
            value={radius}
            onChange={(event) => onRadiusChange(Number(event.target.value))}
          />
        </label>
      </div>
    </section>
  )
}
