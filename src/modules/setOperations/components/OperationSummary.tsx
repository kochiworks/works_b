import { useMemo } from 'react'
import { elementsOf, sameRegions, shadedRegions } from '../lib/expressions'
import type { OperationEntry } from '../lib/operations'
import { buildSteps } from '../lib/steps'
import { roster } from '../lib/types'
import type { Membership } from '../lib/types'
import { useStepAnimation } from '../hooks/useStepAnimation'
import { AnimationControls } from './AnimationControls'
import { Katex } from './Katex'
import { StepTrail } from './StepTrail'
import { VennDiagram } from './VennDiagram'

interface Props {
  operation: OperationEntry
  universe: number[]
  membership: Record<number, Membership>
}

/**
 * A plain operation gets one diagram; a law gets both sides drawn side by side,
 * which is the textbook's own way of checking it — colour each in and compare.
 *
 * Either way the picture is built a step at a time, in the order the expression
 * itself is built: (A ∪ B)ᶜ appears as A → B → A ∪ B → (A ∪ B)ᶜ. Both sides of
 * a law advance on one shared index, so the two constructions can be watched
 * against each other; a side with fewer steps waits on its last one until the
 * other catches up.
 *
 * The verdict below is computed from the regions, so it says whether the two
 * shadings really do match rather than asserting that they must. It is held
 * back until the build finishes, so the comparison is the conclusion of
 * watching rather than a spoiler above it.
 */
export function OperationSummary({ operation, universe, membership }: Props) {
  const { setCount } = operation

  const sides = useMemo(
    () =>
      operation.sides.map((side) => ({
        headline: side.tex,
        steps: buildSteps(side.expr, side.tex),
      })),
    [operation],
  )

  const stepCount = Math.max(...sides.map((side) => side.steps.length))
  const anim = useStepAnimation(stepCount, operation.id)

  const [left, right] = operation.sides
  const isLaw = right !== undefined
  const finished = anim.index >= anim.total
  const regionsMatch = right ? sameRegions(left.expr, right.expr, setCount) : true

  const shown = sides.map((side, index) => {
    const step = side.steps[Math.min(anim.index, side.steps.length - 1)]
    return {
      ...side,
      // The prefix becomes an SVG element id and is referenced as url(#…), so
      // it has to stay a plain identifier — a headline like (A \cup B)^{c}
      // would silently break every mask and leave the regions unclipped.
      idPrefix: `${operation.id}-${index}`,
      step,
      regions: shadedRegions(step.expr, setCount),
      elements: elementsOf(step.expr, universe, membership, setCount),
    }
  })

  const elementsMatch = isLaw ? roster(shown[0].elements) === roster(shown[1].elements) : true

  return (
    <>
      <section className={isLaw ? 'panel venn-pair' : 'panel'}>
        {shown.map((side) => (
          <figure key={side.headline} className="venn-column">
            <figcaption className="venn-column-tex">
              <Katex tex={side.step.tex} />
            </figcaption>
            <VennDiagram
              idPrefix={side.idPrefix}
              setCount={setCount}
              shaded={side.regions}
              universe={universe}
              membership={membership}
            />
            <p className="venn-column-roster">
              <Katex tex={`= ${roster(side.elements)}`} />
            </p>
          </figure>
        ))}
      </section>

      <AnimationControls
        index={anim.index}
        total={anim.total}
        playing={anim.playing}
        speed={anim.speed}
        onSpeedChange={anim.setSpeed}
        onPlayFromStart={anim.playFromStart}
        onPause={anim.pause}
        onResume={anim.resume}
        onSkipToEnd={anim.skipToEnd}
        onStepForward={anim.stepForward}
        onStepBack={anim.stepBack}
      />

      <section className="panel">
        <h2>{isLaw ? '양변의 계산 순서' : '계산 순서'}</h2>
        <div className={isLaw ? 'step-trail-pair' : ''}>
          {sides.map((side, index) => (
            <StepTrail
              key={side.headline}
              steps={side.steps}
              index={anim.index}
              heading={isLaw ? `${index === 0 ? '좌변' : '우변'}\\ :\\ ${side.headline}` : undefined}
            />
          ))}
        </div>
        <p className="hint">{operation.meaning}</p>
      </section>

      {isLaw &&
        (finished ? (
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
        ) : (
          <p className="verdict is-pending">
            ⏳ 양변을 끝까지 그린 뒤에 두 그림이 같은지 확인합니다. 마지막 단계까지 재생해보세요.
          </p>
        ))}
    </>
  )
}
