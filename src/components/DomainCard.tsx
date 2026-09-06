import type { DomainMeta, SubjectMeta } from '../modules/registry'
import { domainHref } from '../lib/routes'

/**
 * Subject-page card for one curriculum domain. It lists the activity titles it
 * holds so a teacher can tell from the subject page whether the strand they
 * need is already covered, without opening it.
 */
export function DomainCard({ subject, domain }: { subject: SubjectMeta; domain: DomainMeta }) {
  const count = domain.activities.length

  return (
    <a className={`browse-domain-card accent-${domain.accent}`} href={domainHref(subject, domain)}>
      <div className="browse-domain-card-icon browse-icon">{domain.icon}</div>
      <h2 className="browse-domain-card-title">{domain.title}</h2>
      <p className="browse-domain-card-subtitle">{domain.subtitle}</p>
      <p className="browse-domain-card-description">{domain.description}</p>

      {count > 0 ? (
        <ul className="browse-domain-card-activities">
          {domain.activities.map((activity) => (
            <li key={activity.id}>
              <span aria-hidden="true">{activity.icon}</span> {activity.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="browse-domain-card-empty">활동을 준비하고 있습니다.</p>
      )}

      <span className="browse-cta">{count > 0 ? `활동 ${count}개 보기 →` : '살펴보기 →'}</span>
    </a>
  )
}
