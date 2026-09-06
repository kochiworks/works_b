import type { SchoolLevelMeta } from '../modules/registry'
import { courseEntries, isCourseOpen, levelActivityCount } from '../modules/registry'
import { levelHref } from '../lib/routes'

/**
 * Home-page card for one school level. The chips preview the grades or
 * subjects that already have something in them, with the still-empty ones
 * summed up in a single muted chip rather than listed one by one — 고등학교
 * alone carries thirteen subjects.
 */
export function LevelCard({ level }: { level: SchoolLevelMeta }) {
  const openCourses = level.courses.filter(isCourseOpen)
  const emptyCount = level.courses.length - openCourses.length

  return (
    <a className={`browse-level-card accent-${level.accent}`} href={levelHref(level)}>
      <div className="browse-level-card-head">
        <div className="browse-level-card-icon browse-icon">{level.icon}</div>
        <div className="browse-level-card-heading">
          <h2 className="browse-level-card-title">{level.title}</h2>
          <p className="browse-level-card-subtitle">{level.subtitle}</p>
        </div>
      </div>

      <p className="browse-level-card-description">{level.description}</p>

      <ul className="browse-level-card-courses">
        {openCourses.map((course) => (
          <li key={course.id} className={`browse-chip accent-${course.accent}`}>
            <span className="browse-chip-icon" aria-hidden="true">
              {course.icon}
            </span>
            <span className="browse-chip-title">{course.title}</span>
            <span className="browse-chip-count">{courseEntries(course).length}</span>
          </li>
        ))}
        {emptyCount > 0 && <li className="browse-chip is-empty">준비 중 {emptyCount}</li>}
      </ul>

      <div className="browse-card-foot">
        <span className="browse-cta">{level.pickLabel} →</span>
        <span className="browse-tag">활동 {levelActivityCount(level)}개</span>
      </div>
    </a>
  )
}
