import type { BeadState } from '../lib/types'

interface Props {
  cells: BeadState[]
  label?: string
}

const BEAD_CLASS: Record<BeadState, string> = {
  empty: 'bead bead--empty',
  a: 'bead bead--a',
  b: 'bead bead--b',
  removed: 'bead bead--removed',
  remainder: 'bead bead--remainder',
}

/** One 10-bead rail — the "10알 교구" unit every board is built from. Beads 6–10
 *  get a small extra gap (bead--group-start) so the row reads as two groups of
 *  five at a glance, the same subitizing cue a real rekenrek/구슬셈판 gives by
 *  color-splitting the string at its midpoint. */
export function BeadRow({ cells, label }: Props) {
  return (
    <div className="bead-row">
      {label && <span className="bead-row-label">{label}</span>}
      <div className="bead-rail">
        {cells.map((state, index) => (
          <span key={index} className={`${BEAD_CLASS[state]}${index === 5 ? ' bead--group-start' : ''}`}>
            {state === 'removed' && (
              <span className="bead-mark" aria-hidden="true">
                ×
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
