import { SCHOOL_LEVELS } from '../modules/registry'
import { LevelCard } from '../components/LevelCard'

/** Top of the tree: pick a school level, then a grade or subject, then an activity. */
export function HomePage() {
  return (
    <div className="browse">
      <section className="browse-hero">
        <p className="browse-hero-eyebrow">선생님과 학생을 위한 수학 시뮬레이션</p>
        <h1 className="browse-hero-title">눈으로 보고, 손으로 만지는 수학</h1>
        <p className="browse-hero-subtitle">
          공식을 외우기 전에 직접 조작해보며 원리를 확인하는 수업용 시뮬레이션 모음입니다. 학교급을 고르면 학년과
          과목별로 정리된 활동을 볼 수 있습니다.
        </p>
      </section>

      <section className="browse-level-grid" aria-label="학교급">
        {SCHOOL_LEVELS.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </section>
    </div>
  )
}
