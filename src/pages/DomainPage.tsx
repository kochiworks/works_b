import type { DomainMeta, SubjectMeta } from '../modules/registry'
import { ActivityCard } from '../components/ActivityCard'
import { PageIntro } from '../components/PageIntro'
import { subjectHref } from '../lib/routes'

/** Bottom of the tree: every activity that belongs to one domain. */
export function DomainPage({ subject, domain }: { subject: SubjectMeta; domain: DomainMeta }) {
  return (
    <div className="browse">
      <PageIntro
        accent={domain.accent}
        icon={domain.icon}
        title={domain.title}
        subtitle={domain.subtitle}
        description={domain.description}
        back={{ label: subject.title, href: subjectHref(subject) }}
      />

      {domain.activities.length > 0 ? (
        <>
          <p className="browse-count">활동 {domain.activities.length}개</p>
          <section className="browse-activity-grid" aria-label={`${domain.title} 활동`}>
            {domain.activities.map((activity) => (
              <ActivityCard key={activity.id} subject={subject} domain={domain} activity={activity} />
            ))}
          </section>
        </>
      ) : (
        <p className="browse-empty">이 영역의 활동은 아직 준비 중입니다.</p>
      )}
    </div>
  )
}
