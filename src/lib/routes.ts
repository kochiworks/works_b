import type { ActivityMeta, CourseMeta, SchoolLevelMeta } from '../modules/registry'
import { courseEntries, findCourse, findLevel, isActivityOpen, primaryPlacement } from '../modules/registry'

/**
 * The four screens the site can show, already resolved against the registry so
 * that pages never have to look anything up by id again.
 */
export type Route =
  | { kind: 'home' }
  | { kind: 'level'; level: SchoolLevelMeta }
  | { kind: 'course'; level: SchoolLevelMeta; course: CourseMeta }
  | { kind: 'activity'; level: SchoolLevelMeta; course: CourseMeta; activity: ActivityMeta }
  | { kind: 'not-found'; path: string }

/**
 * Id of the single "수학" subject the site briefly used as its first level,
 * before browsing moved to school level and grade. Addresses beginning with it
 * are treated as old links rather than as a level.
 */
const RETIRED_SUBJECT_ID = 'math'

export const HOME_HREF = '#/'

export function levelHref(level: SchoolLevelMeta): string {
  return `#/${level.id}`
}

export function courseHref(level: SchoolLevelMeta, course: CourseMeta): string {
  return `#/${level.id}/${course.id}`
}

export function activityHref(level: SchoolLevelMeta, course: CourseMeta, activity: ActivityMeta): string {
  return `#/${level.id}/${course.id}/${activity.id}`
}

/**
 * Turns a hash path such as "high/probability-statistics/probability" into a
 * Route. The number of segments picks the level:
 *
 *   ""                              → home, the school-level gallery
 *   "high"                          → one school level, its courses
 *   "high/<course>"                 → one grade or subject, its activities
 *   "high/<course>/<activity>"      → the activity itself
 *
 * Two older address shapes are still understood, because links to them were
 * shared before this tree existed: a bare `#/<activityId>`, and the short-lived
 * `#/math/<domain>/<activityId>`. Both land on the activity's first placement,
 * and App then rewrites the address bar to the canonical form.
 */
export function resolveRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean)
  const notFound: Route = { kind: 'not-found', path }

  if (segments.length === 0) return { kind: 'home' }
  if (segments.length > 3) return notFound

  const [first, second, third] = segments
  const level = findLevel(first)

  if (!level) {
    if (first === RETIRED_SUBJECT_ID) {
      // "#/math" and "#/math/<domain>" were listing pages that no longer
      // exist; only the three-segment form still names an activity.
      return segments.length === 3 ? asActivity(third) ?? notFound : { kind: 'home' }
    }
    return segments.length === 1 ? asActivity(first) ?? notFound : notFound
  }

  if (segments.length === 1) return { kind: 'level', level }

  const course = findCourse(level, second)
  if (!course) return notFound
  if (segments.length === 2) return { kind: 'course', level, course }

  const entry = courseEntries(course).find(({ activity }) => activity.id === third)
  if (!entry || !isActivityOpen(entry.activity)) return notFound
  return { kind: 'activity', level, course, activity: entry.activity }
}

/**
 * The address this route should live at, without the leading "#/". Returns
 * null for a route that must not rewrite the address bar (a bad path is left
 * alone so the reader can see what they typed or followed).
 */
export function canonicalPath(route: Route): string | null {
  switch (route.kind) {
    case 'home':
      return ''
    case 'level':
      return route.level.id
    case 'course':
      return `${route.level.id}/${route.course.id}`
    case 'activity':
      return `${route.level.id}/${route.course.id}/${route.activity.id}`
    case 'not-found':
      return null
  }
}

/** Title for the browser tab, so history entries stay tellable apart. */
export function routeTitle(route: Route): string {
  const site = '수학 탐구 놀이터'
  switch (route.kind) {
    case 'home':
      return site
    case 'level':
      return `${route.level.title} · ${site}`
    case 'course':
      return `${route.course.title} · ${site}`
    case 'activity':
      return `${route.activity.title} · ${site}`
    case 'not-found':
      return `페이지를 찾을 수 없습니다 · ${site}`
  }
}

function asActivity(activityId: string): Route | undefined {
  const placement = primaryPlacement(activityId)
  return placement && isActivityOpen(placement.activity) ? { kind: 'activity', ...placement } : undefined
}
