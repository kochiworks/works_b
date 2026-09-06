import type { CourseMeta, SchoolLevelMeta } from '../modules/registry'
import { courseEntries, isCourseOpen } from '../modules/registry'
import { courseHref } from '../lib/routes'

/**
 * School-level-page card for one grade or subject. A course with nothing in it
 * yet still gets a card — dimmed and unlinked — so the shape of the curriculum
 * stays visible and it is obvious where an activity is still missing.
 */
export function CourseCard({ level, course }: { level: SchoolLevelMeta; course: CourseMeta }) {
  const entries = courseEntries(course)
  const isOpen = isCourseOpen(course)
  const className = `browse-course-card accent-${course.accent}${isOpen ? '' : ' is-soon'}`

  const content = (
    <>
      <div className="browse-course-card-icon browse-icon">{course.icon}</div>
      <h2 className="browse-course-card-title">{course.title}</h2>
      <p className="browse-course-card-subtitle">{course.subtitle}</p>
      <p className="browse-course-card-description">{course.description}</p>

      {entries.length > 0 && (
        <ul className="browse-course-card-activities">
          {entries.map(({ activity, label }) => (
            <li key={activity.id}>
              <span aria-hidden="true">{activity.icon}</span> {label}
            </li>
          ))}
        </ul>
      )}

      {isOpen ? (
        <span className="browse-cta">활동 {entries.length}개 보기 →</span>
      ) : (
        <span className="browse-badge">준비 중</span>
      )}
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
    <a className={className} href={courseHref(level, course)}>
      {content}
    </a>
  )
}
