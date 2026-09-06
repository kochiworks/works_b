import type { ActivityMeta, DomainMeta, SubjectMeta } from '../modules/registry'
import { findDomain, findSubject, findActivity, locateActivity } from '../modules/registry'

/**
 * The four screens the site can show, already resolved against the registry so
 * that pages never have to look anything up by id again.
 */
export type Route =
  | { kind: 'home' }
  | { kind: 'subject'; subject: SubjectMeta }
  | { kind: 'domain'; subject: SubjectMeta; domain: DomainMeta }
  | { kind: 'activity'; subject: SubjectMeta; domain: DomainMeta; activity: ActivityMeta }
  | { kind: 'not-found'; path: string }

export const HOME_HREF = '#/'

export function subjectHref(subject: SubjectMeta): string {
  return `#/${subject.id}`
}

export function domainHref(subject: SubjectMeta, domain: DomainMeta): string {
  return `#/${subject.id}/${domain.id}`
}

export function activityHref(subject: SubjectMeta, domain: DomainMeta, activity: ActivityMeta): string {
  return `#/${subject.id}/${domain.id}/${activity.id}`
}

/**
 * Turns a hash path such as "math/data-and-possibility/probability" into a
 * Route. The number of segments picks the level:
 *
 *   ""                          → home, the subject gallery
 *   "math"                      → one subject, its domains
 *   "math/<domain>"             → one domain, its activities
 *   "math/<domain>/<activity>"  → the activity itself
 *
 * A single segment that is not a subject is also tried as a bare activity id,
 * because links of the old flat form `#/probability` were shared before the
 * subject and domain levels existed. Those still open the right activity;
 * App then rewrites the address bar to the canonical three-segment form.
 */
export function resolveRoute(path: string): Route {
  const segments = path.split('/').filter(Boolean)
  const notFound: Route = { kind: 'not-found', path }

  if (segments.length === 0) return { kind: 'home' }
  if (segments.length > 3) return notFound

  const [subjectId, domainId, activityId] = segments
  const subject = findSubject(subjectId)

  if (!subject) {
    if (segments.length > 1) return notFound
    const located = locateActivity(subjectId)
    return located && isOpen(located.activity) ? { kind: 'activity', ...located } : notFound
  }

  if (segments.length === 1) return { kind: 'subject', subject }

  const domain = findDomain(subject, domainId)
  if (!domain) return notFound
  if (segments.length === 2) return { kind: 'domain', subject, domain }

  const activity = findActivity(domain, activityId)
  if (!activity || !isOpen(activity)) return notFound
  return { kind: 'activity', subject, domain, activity }
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
    case 'subject':
      return route.subject.id
    case 'domain':
      return `${route.subject.id}/${route.domain.id}`
    case 'activity':
      return `${route.subject.id}/${route.domain.id}/${route.activity.id}`
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
    case 'subject':
      return `${route.subject.title} · ${site}`
    case 'domain':
      return `${route.domain.title} · ${site}`
    case 'activity':
      return `${route.activity.title} · ${site}`
    case 'not-found':
      return `페이지를 찾을 수 없습니다 · ${site}`
  }
}

function isOpen(activity: ActivityMeta): boolean {
  return activity.status === 'available' && activity.Component !== undefined
}
