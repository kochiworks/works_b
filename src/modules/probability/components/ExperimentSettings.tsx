import { BALL_GROUP_COUNT_MAX, BALL_GROUP_COUNT_MIN, COIN_COUNT_MAX, COIN_COUNT_MIN, DICE_COUNT_MAX, DICE_COUNT_MIN } from '../lib/experiments'
import type { BallGroup } from '../lib/experiments'
import type { ExperimentKind } from '../lib/types'

interface Props {
  kind: ExperimentKind
  coinCount: number
  onCoinCountChange: (count: number) => void
  diceCount: number
  onDiceCountChange: (count: number) => void
  ballGroups: BallGroup[]
  onBallGroupCountChange: (id: string, count: number) => void
  onBallGroupRename: (id: string, label: string) => void
}

export function ExperimentSettings({
  kind,
  coinCount,
  onCoinCountChange,
  diceCount,
  onDiceCountChange,
  ballGroups,
  onBallGroupCountChange,
  onBallGroupRename,
}: Props) {
  if (kind === 'coin') {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>동전 개수</h2>
          <div className="stepper">
            <button
              type="button"
              onClick={() => onCoinCountChange(coinCount - 1)}
              disabled={coinCount <= COIN_COUNT_MIN}
              aria-label="동전 개수 줄이기"
            >
              −
            </button>
            <span>{coinCount}</span>
            <button
              type="button"
              onClick={() => onCoinCountChange(coinCount + 1)}
              disabled={coinCount >= COIN_COUNT_MAX}
              aria-label="동전 개수 늘리기"
            >
              +
            </button>
          </div>
        </div>
        <p className="hint">
          동전 {coinCount}개를 동시에 던집니다. 표본공간의 크기는 2<sup>{coinCount}</sup> = {2 ** coinCount}가지입니다.
        </p>
      </section>
    )
  }

  if (kind === 'dice') {
    return (
      <section className="panel">
        <div className="panel-header">
          <h2>주사위 개수</h2>
          <div className="stepper">
            <button
              type="button"
              onClick={() => onDiceCountChange(diceCount - 1)}
              disabled={diceCount <= DICE_COUNT_MIN}
              aria-label="주사위 개수 줄이기"
            >
              −
            </button>
            <span>{diceCount}</span>
            <button
              type="button"
              onClick={() => onDiceCountChange(diceCount + 1)}
              disabled={diceCount >= DICE_COUNT_MAX}
              aria-label="주사위 개수 늘리기"
            >
              +
            </button>
          </div>
        </div>
        <p className="hint">
          주사위 {diceCount}개를 동시에 굴립니다. 표본공간의 크기는 6<sup>{diceCount}</sup> = {6 ** diceCount}가지입니다.
        </p>
      </section>
    )
  }

  const totalBalls = ballGroups.reduce((sum, g) => sum + g.count, 0)

  return (
    <section className="panel">
      <h2>주머니 속 공</h2>
      <div className="ball-group-list">
        {ballGroups.map((group) => (
          <div key={group.id} className="ball-group-row">
            <span className="ball-swatch" style={{ background: group.color }} />
            <input
              type="text"
              className="ball-name-input"
              value={group.label}
              maxLength={6}
              onChange={(event) => onBallGroupRename(group.id, event.target.value)}
              aria-label="공 색 이름"
            />
            <div className="stepper">
              <button
                type="button"
                onClick={() => onBallGroupCountChange(group.id, group.count - 1)}
                disabled={group.count <= BALL_GROUP_COUNT_MIN}
                aria-label={`${group.label} 공 개수 줄이기`}
              >
                −
              </button>
              <span>{group.count}</span>
              <button
                type="button"
                onClick={() => onBallGroupCountChange(group.id, group.count + 1)}
                disabled={group.count >= BALL_GROUP_COUNT_MAX}
                aria-label={`${group.label} 공 개수 늘리기`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="hint">주머니에는 공이 모두 {totalBalls}개 들어 있습니다. (복원추출: 꺼낸 공은 다시 넣어요)</p>
    </section>
  )
}
