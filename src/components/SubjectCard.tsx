import type { SubjectMeta } from '../modules/registry'
import { subjectActivities } from '../modules/registry'
import { subjectHref } from '../lib/routes'

/**
 * Home-page card for one subject. The whole card is the link into the
 * subject's domain list; the domain chips inside are a preview of what is
 * behind it, not links, so the card stays a single click target.
 */
export function SubjectCard({ subject }: { subject: SubjectMeta }) {
  const isAvailable = subject.status === 'available'
  const activityCount = subjectActivities(subject).length
  const className = `browse-subject-card accent-${subject.accent}${isAvailable ? '' : ' is-soon'}`

  const content = (
    <>
      <div className="browse-subject-card-head">
        <div className="browse-subject-card-icon browse-icon">{subject.icon}</div>
        <div className="browse-subject-card-heading">
          <h2 className="browse-subject-card-title">{subject.title}</h2>
          <p className="browse-subject-card-subtitle">{subject.subtitle}</p>
        </div>
        {isAvailable ? (
          <span className="browse-subject-card-meta">
            영역 {subject.domains.length} · 활동 {activityCount}
          </span>
        ) : (
          <span className="browse-badge">준비 중</span>
        )}
      </div>

      <p className="browse-subject-card-description">{subject.description}</p>

      {subject.domains.length > 0 && (
        <ul className="browse-subject-card-domains">
          {subject.domains.map((domain) => (
            <li key={domain.id} className={`browse-chip accent-${domain.accent}`}>
              <span className="browse-chip-icon" aria-hidden="true">
                {domain.icon}
              </span>
              <span className="browse-chip-title">{domain.title}</span>
              <span className="browse-chip-count">{domain.activities.length}</span>
            </li>
          ))}
        </ul>
      )}

      {isAvailable && <span className="browse-cta">영역 고르기 →</span>}
    </>
  )

  if (!isAvailable) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <a className={className} href={subjectHref(subject)}>
      {content}
    </a>
  )
}
