import type { ResultCase } from '../lib/types'

interface Props {
  /** Currently revealed rows (may be a prefix of the full result during the build animation). */
  cases: ResultCase[]
  r: number
  /** Full result count, used to tell "genuinely no matches" apart from "animation hasn't started". */
  totalCases: number
}

export function ResultTable({ cases, r, totalCases }: Props) {
  if (totalCases === 0) {
    return <p className="hint">조건을 만족하는 경우가 없습니다.</p>
  }

  const columns = Array.from({ length: r }, (_, i) => `${i + 1}번째`)

  return (
    <div className="table-scroll">
      <table className="result-table">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map((kase, index) => (
            <tr key={index}>
              <td className="row-index">{index + 1}</td>
              {kase.map((item, position) => (
                <td key={`${item.id}-${position}`}>{item.name}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
