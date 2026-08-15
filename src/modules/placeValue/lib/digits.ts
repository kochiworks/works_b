export interface PlaceDigits {
  hundreds: number
  tens: number
  ones: number
}

export function toDigits(n: number): PlaceDigits {
  return {
    hundreds: Math.floor(n / 100),
    tens: Math.floor((n % 100) / 10),
    ones: n % 10,
  }
}

export function fromDigits(d: PlaceDigits): number {
  return d.hundreds * 100 + d.tens * 10 + d.ones
}

export const EMPTY_DIGITS: PlaceDigits = { hundreds: 0, tens: 0, ones: 0 }

/** Which places a number actually needs written out — a 2-digit number like
 *  47 shouldn't show a leading "0" in its hundreds column, and 0 itself
 *  should still show as a single "0" in the ones place rather than
 *  disappearing entirely. */
export function significantPlaces(n: number): ('hundreds' | 'tens' | 'ones')[] {
  if (n >= 100) return ['hundreds', 'tens', 'ones']
  if (n >= 10) return ['tens', 'ones']
  return ['ones']
}
