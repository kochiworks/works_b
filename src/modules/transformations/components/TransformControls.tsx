import { GRID_MAX, GRID_MIN } from '../hooks/useTransformState'
import { REFLECTION_AXIS_LABELS, TRANSFORM_TYPE_LABELS, isTransformAllowedForShape } from '../lib/types'
import type { ReflectionAxis, RotationAngle, ShapeKind, TransformParams, TransformType } from '../lib/types'

const TRANSFORM_TYPES: TransformType[] = ['translate', 'reflect', 'rotate']
const AXES: ReflectionAxis[] = ['x', 'y', 'origin', 'yEqualsX']
const ANGLES: RotationAngle[] = [90, 180, 270]

interface Props {
  shapeKind: ShapeKind
  params: TransformParams
  onTypeChange: (type: TransformType) => void
  onDxChange: (dx: number) => void
  onDyChange: (dy: number) => void
  onAxisChange: (axis: ReflectionAxis) => void
  onAngleChange: (angle: RotationAngle) => void
}

export function TransformControls({
  shapeKind,
  params,
  onTypeChange,
  onDxChange,
  onDyChange,
  onAxisChange,
  onAngleChange,
}: Props) {
  const availableTypes = TRANSFORM_TYPES.filter((type) => isTransformAllowedForShape(shapeKind, type, params.axis))
  const availableAxes = AXES.filter((axis) => isTransformAllowedForShape(shapeKind, 'reflect', axis))

  return (
    <section className="panel">
      <h2>이동 방법</h2>
      <div className="mode-tabs">
        {availableTypes.map((type) => (
          <button
            key={type}
            type="button"
            className={type === params.type ? 'mode-tab active' : 'mode-tab'}
            onClick={() => onTypeChange(type)}
          >
            {TRANSFORM_TYPE_LABELS[type]}
          </button>
        ))}
      </div>
      {shapeKind === 'quadratic' && <p className="hint">이 도형은 평행이동과 대칭이동(y=x 제외)만 지원합니다.</p>}

      {params.type === 'translate' && (
        <div className="transform-params">
          <label className="param-row">
            <span>x축 방향으로 {params.dx}만큼</span>
            <input
              type="range"
              min={GRID_MIN}
              max={GRID_MAX}
              value={params.dx}
              onChange={(event) => onDxChange(Number(event.target.value))}
            />
          </label>
          <label className="param-row">
            <span>y축 방향으로 {params.dy}만큼</span>
            <input
              type="range"
              min={GRID_MIN}
              max={GRID_MAX}
              value={params.dy}
              onChange={(event) => onDyChange(Number(event.target.value))}
            />
          </label>
        </div>
      )}

      {params.type === 'reflect' && (
        <div className="transform-params">
          <div className="mode-tabs">
            {availableAxes.map((axis) => (
              <button
                key={axis}
                type="button"
                className={axis === params.axis ? 'mode-tab active' : 'mode-tab'}
                onClick={() => onAxisChange(axis)}
              >
                {REFLECTION_AXIS_LABELS[axis]}
              </button>
            ))}
          </div>
        </div>
      )}

      {params.type === 'rotate' && (
        <div className="transform-params">
          <div className="mode-tabs">
            {ANGLES.map((angle) => (
              <button
                key={angle}
                type="button"
                className={angle === params.angle ? 'mode-tab active' : 'mode-tab'}
                onClick={() => onAngleChange(angle)}
              >
                {angle}°
              </button>
            ))}
          </div>
          <p className="hint">원점을 중심으로 시계 반대 방향으로 회전합니다.</p>
        </div>
      )}
    </section>
  )
}
