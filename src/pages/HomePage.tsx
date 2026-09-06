import { SUBJECTS } from '../modules/registry'
import { SubjectCard } from '../components/SubjectCard'

/** Top of the tree: pick a subject, then a domain, then an activity. */
export function HomePage() {
  return (
    <div className="browse">
      <section className="browse-hero">
        <p className="browse-hero-eyebrow">선생님과 학생을 위한 교과 시뮬레이션</p>
        <h1 className="browse-hero-title">눈으로 보고, 손으로 만지는 수업</h1>
        <p className="browse-hero-subtitle">
          공식을 외우기 전에 직접 조작해보며 원리를 확인하는 수업용 시뮬레이션 모음입니다. 교과를 고르면 교육과정
          영역별로 정리된 활동을 볼 수 있습니다.
        </p>
      </section>

      <section className="browse-subject-grid" aria-label="교과">
        {SUBJECTS.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </section>
    </div>
  )
}
