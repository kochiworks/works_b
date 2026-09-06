import type { SchoolLevelMeta } from '../modules/registry'
import { courseBands, levelActivityCount } from '../modules/registry'
import { CourseCard } from '../components/CourseCard'
import { PageIntro } from '../components/PageIntro'
import { HOME_HREF } from '../lib/routes'

/**
 * Middle of the tree: the grades or subjects inside one school level. 고등학교
 * splits its thirteen subjects into 공통 / 일반 선택 / 진로 선택 / 융합 선택
 * headings; 초·중 have no bands and render as one grid.
 */
export function LevelPage({ level }: { level: SchoolLevelMeta }) {
  const bands = courseBands(level)
  const unit = level.id === 'high' ? '과목' : '학년'

  return (
    <div className="browse">
      <PageIntro
        accent={level.accent}
        icon={level.icon}
        title={level.title}
        subtitle={level.subtitle}
        description={level.description}
        back={{ label: '학교급 전체', href: HOME_HREF }}
      />

      <p className="browse-count">
        {unit} {level.courses.length}개 · 활동 {levelActivityCount(level)}개
      </p>

      {bands.map((group, index) => (
        <section
          key={group.band ?? index}
          className="browse-band"
          aria-label={group.band ? `${level.title} ${group.band}` : `${level.title} ${unit}`}
        >
          {group.band && <h2 className="browse-band-title">{group.band}</h2>}
          <div className="browse-course-grid">
            {group.courses.map((course) => (
              <CourseCard key={course.id} level={level} course={course} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
