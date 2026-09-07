import { Fragment } from 'react'
import { SET_NAMES, UNIVERSE_MAX, UNIVERSE_MIN } from '../lib/types'
import type { Membership, SetName } from '../lib/types'

interface Props {
  universe: number[]
  universeSize: number
  membership: Record<number, Membership>
  /** Two sets for the relation step, three when the operation needs C. */
  setCount: 2 | 3
  onToggle: (value: number, name: SetName) => void
  onSizeChange: (size: number) => void
  onClear: () => void
}

/**
 * The universe as one row per element, with a button per set. Tapping a button
 * moves that element in or out of the set, and the diagram beside it re-draws —
 * this is the only place memberships are edited in steps 2 and 3.
 */
export function MembershipGrid({
  universe,
  universeSize,
  membership,
  setCount,
  onToggle,
  onSizeChange,
  onClear,
}: Props) {
  const names: SetName[] = SET_NAMES.slice(0, setCount)

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>전체집합 U와 원소 배치</h2>
        <button type="button" className="link-btn" onClick={onClear}>
          모두 비우기
        </button>
      </div>

      <label className="param-row">
        <span>
          U = {'{'}1, 2, …, {universeSize}
          {'}'}
        </span>
        <input
          type="range"
          min={UNIVERSE_MIN}
          max={UNIVERSE_MAX}
          step={1}
          value={universeSize}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        />
      </label>

      {/* One grid, flat children: the header cells and every element's buttons
          are direct children so the columns line up across all rows. */}
      <div className="membership-grid" style={{ ['--set-count' as string]: names.length }}>
        <span className="membership-head">원소</span>
        {names.map((name) => (
          <span key={`head-${name}`} className="membership-head">
            {name}
          </span>
        ))}

        {universe.map((value) => (
          <Fragment key={value}>
            <span className="membership-value">{value}</span>
            {names.map((name) => {
              const on = membership[value]?.[name] ?? false
              return (
                <button
                  key={name}
                  type="button"
                  data-element={value}
                  data-set={name}
                  className={on ? `membership-toggle is-on set-${name.toLowerCase()}` : 'membership-toggle'}
                  aria-pressed={on}
                  aria-label={`원소 ${value}를 집합 ${name}에 ${on ? '빼기' : '넣기'}`}
                  onClick={() => onToggle(value, name)}
                >
                  {on ? '●' : '○'}
                </button>
              )
            })}
          </Fragment>
        ))}
      </div>

      <p className="hint">동그라미를 눌러 원소를 각 집합에 넣거나 뺄 수 있습니다.</p>
    </section>
  )
}
