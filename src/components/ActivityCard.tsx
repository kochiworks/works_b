import type { ActivityMeta, DomainMeta, SubjectMeta } from '../modules/registry'
import { activityHref } from '../lib/routes'

/** Domain-page card for one simulation — the deepest level of the tree. */
export function ActivityCard({
  subject,
  domain,
  activity,
}: {
  subject: SubjectMeta
  domain: DomainMeta
  activity: ActivityMeta
}) {
  const isAvailable = activity.status === 'available' && activity.Component !== undefined
  const className = `browse-activity-card accent-${activity.accent}${isAvailable ? '' : ' is-soon'}`

  const content = (
    <>
      <div className="browse-activity-card-icon browse-icon">{activity.icon}</div>
      <h2 className="browse-activity-card-title">{activity.title}</h2>
      <p className="browse-activity-card-subtitle">{activity.subtitle}</p>
      <p className="browse-activity-card-description">{activity.description}</p>
      {isAvailable ? (
        <span className="browse-cta">시작하기 →</span>
      ) : (
        <span className="browse-badge">준비 중</span>
      )}
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
    <a className={className} href={activityHref(subject, domain, activity)}>
      {content}
    </a>
  )
}
