interface Props {
  candidates: number[]
  selected: number[]
  /** After 확인, which picks were wrong and which answers were missed. */
  verdict?: { missing: number[]; extra: number[] } | null
  onToggle: (value: number) => void
}

/** The pool of numbers to pick from in step 1. */
export function CandidateBoard({ candidates, selected, verdict, onToggle }: Props) {
  const picked = new Set(selected)
  const missing = new Set(verdict?.missing ?? [])
  const extra = new Set(verdict?.extra ?? [])

  return (
    <div className="candidate-board">
      {candidates.map((value) => {
        const classes = ['candidate']
        if (picked.has(value)) classes.push('is-picked')
        if (extra.has(value)) classes.push('is-extra')
        if (missing.has(value)) classes.push('is-missing')
        return (
          <button
            key={value}
            type="button"
            className={classes.join(' ')}
            aria-pressed={picked.has(value)}
            onClick={() => onToggle(value)}
          >
            {value}
          </button>
        )
      })}
    </div>
  )
}
