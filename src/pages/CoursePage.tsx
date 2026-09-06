import type { CourseMeta, SchoolLevelMeta } from '../modules/registry'
import { courseEntries } from '../modules/registry'
import { ActivityCard } from '../components/ActivityCard'
import { PageIntro } from '../components/PageIntro'
import { levelHref } from '../lib/routes'

/** Bottom of the tree: every activity placed in one grade or subject. */
export function CoursePage({ level, course }: { level: SchoolLevelMeta; course: CourseMeta }) {
  const entries = courseEntries(course)

  return (
    <div className="browse">
      <PageIntro
        accent={course.accent}
        icon={course.icon}
        title={course.title}
        subtitle={course.subtitle}
        description={course.description}
        back={{ label: level.title, href: levelHref(level) }}
      />

      {entries.length > 0 ? (
        <>
          <p className="browse-count">활동 {entries.length}개</p>
          <section className="browse-activity-grid" aria-label={`${course.title} 활동`}>
            {entries.map(({ activity, label }) => (
              <ActivityCard key={activity.id} level={level} course={course} activity={activity} label={label} />
            ))}
          </section>
        </>
      ) : (
        <p className="browse-empty">이 {level.id === 'high' ? '과목' : '학년'}의 활동은 아직 준비 중입니다.</p>
      )}
    </div>
  )
}
