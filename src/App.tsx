import { useEffect } from 'react'
import type { Crumb } from './components/SiteHeader'
import { SiteHeader } from './components/SiteHeader'
import { DomainPage } from './pages/DomainPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SubjectPage } from './pages/SubjectPage'
import { useHashRoute } from './hooks/useHashRoute'
import type { Route } from './lib/routes'
import { canonicalPath, domainHref, resolveRoute, routeTitle, subjectHref } from './lib/routes'
import './App.css'

function App() {
  const path = useHashRoute()
  const route = resolveRoute(path)
  const canonical = canonicalPath(route)
  const title = routeTitle(route)

  useEffect(() => {
    document.title = title
  }, [title])

  // Old flat links (#/probability) and stray trailing slashes resolve fine but
  // should not stay in the address bar; replace() keeps them out of history so
  // the back button still leaves the site in one step.
  useEffect(() => {
    if (canonical !== null && canonical !== path) {
      window.location.replace(`#/${canonical}`)
    }
  }, [canonical, path])

  // Moving between levels is a full page change, so start each one at the top
  // rather than wherever the previous list was scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  return (
    <div className="site">
      <SiteHeader trail={buildTrail(route)} />
      <main className="site-main">{renderRoute(route)}</main>
      <footer className="site-footer">🔬 수학 탐구 놀이터 · 수업과 자기주도학습을 위한 시뮬레이션</footer>
    </div>
  )
}

function renderRoute(route: Route) {
  switch (route.kind) {
    case 'home':
      return <HomePage />
    case 'subject':
      return <SubjectPage subject={route.subject} />
    case 'domain':
      return <DomainPage subject={route.subject} domain={route.domain} />
    case 'activity': {
      const { Component } = route.activity
      return Component ? <Component /> : <NotFoundPage path={route.activity.id} />
    }
    case 'not-found':
      return <NotFoundPage path={route.path} />
  }
}

/** Breadcrumb after the brand: every level above the current one is a link. */
function buildTrail(route: Route): Crumb[] {
  switch (route.kind) {
    case 'home':
      return []
    case 'subject':
      return [{ label: route.subject.title, icon: route.subject.icon }]
    case 'domain':
      return [
        { label: route.subject.title, icon: route.subject.icon, href: subjectHref(route.subject) },
        { label: route.domain.title, icon: route.domain.icon },
      ]
    case 'activity':
      return [
        { label: route.subject.title, icon: route.subject.icon, href: subjectHref(route.subject) },
        { label: route.domain.title, icon: route.domain.icon, href: domainHref(route.subject, route.domain) },
        { label: route.activity.title, icon: route.activity.icon },
      ]
    case 'not-found':
      return [{ label: '페이지 없음' }]
  }
}

export default App
