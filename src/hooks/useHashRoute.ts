import { useEffect, useState } from 'react'

/**
 * Minimal hash-based router state: reads/tracks `location.hash` (without the
 * leading `#/`), e.g. "combinatorics" for "#/combinatorics", "" for the home
 * page. Hash routing (rather than history/path routing) is deliberate here —
 * this site is a static GitHub Pages build with no server-side rewrites, so a
 * path route would 404 on refresh or direct link; a hash route always resolves
 * to index.html first and never needs server support.
 */
export function useHashRoute(): string {
  const [route, setRoute] = useState(() => readRoute())

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route
}

function readRoute(): string {
  return window.location.hash.replace(/^#\/?/, '')
}
