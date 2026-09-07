import { elementsOf, sameRegions, shadedRegions } from '../lib/expressions'
import type { OperationEntry } from '../lib/operations'
import { roster } from '../lib/types'
import type { Membership } from '../lib/types'
import { Katex } from './Katex'
import { VennDiagram } from './VennDiagram'

interface Props {
  operation: OperationEntry
  universe: number[]
  membership: Record<number, Membership>
}

/**
 * A plain operation gets one shaded diagram; a law gets both sides drawn side
 * by side, which is the textbook's own way of checking it — colour each in and
 * compare. The verdict below is computed from the regions, so it says whether
 * the two shadings really do match rather than asserting that they must.
 */
export function OperationSummary({ operation, universe, membership }: Props) {
  const { setCount } = operation
  const sides = operation.sides.map((side) => ({
    ...side,
    regions: shadedRegions(side.expr, setCount),
    elements: elementsOf(side.expr, universe, membership, setCount),
  }))

  const [left, right] = operation.sides
  const isLaw = right !== undefined
  const regionsMatch = right ? sameRegions(left.expr, right.expr, setCount) : true
  const elementsMatch = right ? roster(sides[0].elements) === roster(sides[1].elements) : true

  return (
    <>
      <section className={isLaw ? 'panel venn-pair' : 'panel'}>
        {sides.map((side, index) => (
          <VennDiagram
            key={side.tex}
            idPrefix={`${operation.id}-${index}`}
            setCount={setCount}
            shaded={side.regions}
            universe={universe}
            membership={membership}
            caption={undefined}
          />
        ))}
      </section>

      <section className="panel">
        <div className="formula-card">
          {sides.map((side) => (
            <div key={side.tex} className="formula-row">
              <Katex tex={`${side.tex} = ${roster(side.elements)}`} className="formula-expression--large" />
            </div>
          ))}
        </div>
        <p className="hint">{operation.meaning}</p>
      </section>

      {isLaw && (
        <p className={regionsMatch && elementsMatch ? 'verdict is-correct' : 'verdict is-wrong'}>
          {regionsMatch && elementsMatch ? (
            <>
              ✅ 두 벤 다이어그램의 색칠된 부분이 완전히 같고, 원소나열법으로 쓴 결과도 같습니다. 원소를 어떻게
              바꿔 놓아도 이 관계는 유지됩니다.
            </>
          ) : (
            <>⚠️ 두 식의 결과가 다르게 나왔습니다.</>
          )}
        </p>
      )}
    </>
  )
}
