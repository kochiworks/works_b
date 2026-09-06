import type { SubjectMeta } from '../modules/registry'
import { subjectActivities } from '../modules/registry'
import { DomainCard } from '../components/DomainCard'
import { PageIntro } from '../components/PageIntro'
import { HOME_HREF } from '../lib/routes'

/** Middle of the tree: the curriculum domains inside one subject. */
export function SubjectPage({ subject }: { subject: SubjectMeta }) {
  const activityCount = subjectActivities(subject).length

  return (
    <div className="browse">
      <PageIntro
        accent={subject.accent}
        icon={subject.icon}
        title={subject.title}
        subtitle={subject.subtitle}
        description={subject.description}
        back={{ label: '교과 전체', href: HOME_HREF }}
      />

      <p className="browse-count">
        영역 {subject.domains.length}개 · 활동 {activityCount}개
      </p>

      <section className="browse-domain-grid" aria-label={`${subject.title} 영역`}>
        {subject.domains.map((domain) => (
          <DomainCard key={domain.id} subject={subject} domain={domain} />
        ))}
      </section>
    </div>
  )
}
