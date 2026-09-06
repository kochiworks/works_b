import type { ActivityMeta, CourseMeta, SchoolLevelMeta } from '../modules/registry'
import { DOMAIN_LABELS, isActivityOpen } from '../modules/registry'
import { activityHref } from '../lib/routes'

interface Props {
  level: SchoolLevelMeta
  course: CourseMeta
  activity: ActivityMeta
  /** What this course calls the activity; falls back to its own subtitle. */
  label: string
}

/** Course-page card for one simulation — the deepest level of the tree. */
export function ActivityCard({ level, course, activity, label }: Props) {
  const isOpen = isActivityOpen(activity)
  const className = `browse-activity-card accent-${activity.accent}${isOpen ? '' : ' is-soon'}`

  const content = (
    <>
      <div className="browse-activity-card-icon browse-icon">{activity.icon}</div>
      <h2 className="browse-activity-card-title">{activity.title}</h2>
      <p className="browse-activity-card-subtitle">{label}</p>
      <p className="browse-activity-card-description">{activity.description}</p>
      <div className="browse-card-foot">
        {isOpen ? <span className="browse-cta">시작하기 →</span> : <span className="browse-badge">준비 중</span>}
        <span className="browse-tag">{DOMAIN_LABELS[activity.domain]}</span>
      </div>
    </>
  )

  if (!isOpen) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    )
  }

  return (
    <a className={className} href={activityHref(level, course, activity)}>
      {content}
    </a>
  )
}
