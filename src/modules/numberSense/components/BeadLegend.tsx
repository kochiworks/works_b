import { legendItems } from '../lib/operationConfigs'
import type { OperationKind } from '../lib/types'

interface Props {
  kind: OperationKind
}

/** What each bead color means for the current operation — the mapping isn't
 *  fixed (e.g. 'a' means "처음 수" for 덧셈 but "묶음 안의 개수" for 곱셈), so this
 *  reads straight from operationConfigs.ts instead of hardcoding text here. */
export function BeadLegend({ kind }: Props) {
  return (
    <div className="legend">
      {legendItems(kind).map((item) => (
        <span key={item.state} className="legend-item">
          <span className={`legend-dot legend-dot--${item.state}`} /> {item.label}
        </span>
      ))}
    </div>
  )
}
