import { MODULES } from '../modules/registry'
import type { ModuleMeta } from '../modules/registry'

export function HomePage() {
  return (
    <div className="home">
      <section className="hero">
        <p className="hero-eyebrow">선생님과 학생을 위한 수학 시뮬레이션</p>
        <h1 className="hero-title">눈으로 보고, 손으로 만지는 수학</h1>
        <p className="hero-subtitle">
          공식을 외우기 전에 직접 조작해보며 원리를 확인하는 수업용 시뮬레이션 모음입니다. 아래에서 단원을
          선택해보세요.
        </p>
      </section>

      <section className="module-grid">
        {MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </section>
    </div>
  )
}

function ModuleCard({ module }: { module: ModuleMeta }) {
  const isAvailable = module.status === 'available'
  const cardClass = `module-card accent-${module.accent}${isAvailable ? '' : ' is-soon'}`

  const content = (
    <>
      <div className="module-card-icon">{module.icon}</div>
      <h2 className="module-card-title">{module.title}</h2>
      <p className="module-card-subtitle">{module.subtitle}</p>
      <p className="module-card-description">{module.description}</p>
      {isAvailable ? (
        <span className="module-card-cta">시작하기 →</span>
      ) : (
        <span className="module-card-badge">준비 중</span>
      )}
    </>
  )

  if (isAvailable) {
    return (
      <a className={cardClass} href={`#/${module.id}`}>
        {content}
      </a>
    )
  }

  return (
    <div className={cardClass} aria-disabled="true">
      {content}
    </div>
  )
}
