import { useEffect, useRef } from 'react'

/** Returns the value this hook was called with on the *previous* render. */
export function usePrevious<T>(value: T): T {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
