import { SUBSET_LIST_LIMIT, subsetsOf } from '../lib/relations'
import type { RelationVerdict } from '../lib/relations'
import { roster } from '../lib/types'
import { Katex } from './Katex'

interface Props {
  a: number[]
  b: number[]
  verdict: RelationVerdict
}

export function RelationSummary({ a, b, verdict }: Props) {
  const intersection = a.filter((value) => b.includes(value))
  const union = [...new Set([...a, ...b])].sort((x, y) => x - y)
  const subsetCount = 2 ** a.length

  return (
    <>
      <section className="panel">
        <div className="formula-card">
          <div className="formula-row">
            <Katex tex={`A = ${roster(a)}`} className="formula-expression--large" />
          </div>
          <div className="formula-row">
            <Katex tex={`B = ${roster(b)}`} className="formula-expression--large" />
          </div>
          <div className="formula-row">
            <Katex tex={`A \\cap B = ${roster(intersection)}`} />
            <Katex tex={`A \\cup B = ${roster(union)}`} />
          </div>
        </div>

        <p className="verdict is-correct relation-verdict">
          <Katex tex={verdict.tex} className="relation-verdict-tex" />
          <strong>{verdict.title}</strong>
          <span>{verdict.explanation}</span>
        </p>
      </section>

      <section className="panel">
        <h2>A의 부분집합</h2>
        <p className="hint">
          원소가 <Katex tex={`n(A) = ${a.length}`} /> 개이므로 부분집합은{' '}
          <Katex tex={`2^{${a.length}} = ${subsetCount}`} /> 개, 자기 자신을 뺀 진부분집합은{' '}
          <Katex tex={`${subsetCount} - 1 = ${subsetCount - 1}`} /> 개입니다.
        </p>
        {a.length <= SUBSET_LIST_LIMIT ? (
          <div className="subset-list">
            {subsetsOf(a).map((subset) => (
              <span key={subset.join('-') || 'empty'} className="subset-chip">
                <Katex tex={roster(subset)} />
              </span>
            ))}
          </div>
        ) : (
          <p className="hint">
            원소가 {SUBSET_LIST_LIMIT}개를 넘으면 부분집합이 너무 많아 개수만 보여줍니다. A의 원소를{' '}
            {SUBSET_LIST_LIMIT}개 이하로 줄이면 전부 나열됩니다.
          </p>
        )}
      </section>
    </>
  )
}
