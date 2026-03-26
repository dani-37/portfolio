import { useState, useEffect } from 'react'

/**
 * Returns how far through its phase a section is (0–1).
 * scrollP: overall scroll progress 0–1
 * sectionIndex: 0-based index of the section (0 = first wipe)
 * numSections: total number of wipe sections (3)
 */
export function sectionProgress(
  scrollP: number,
  sectionIndex: number,
  numSections: number,
): number {
  const phase = 1 / numSections
  const start = sectionIndex * phase
  const end = (sectionIndex + 1) * phase
  return Math.max(0, Math.min(1, (scrollP - start) / (end - start)))
}

/**
 * Converts section progress to the viewport Y position of the wipe line (0–100 vh).
 * 0 = top of viewport (wipe complete), 100 = bottom (wipe not started).
 */
export function lineTopVh(progress: number): number {
  return 100 - progress * 100
}

/**
 * Converts a line position to the clip-path percentage for the card section.
 * cardTopVh: top of card in vh units
 * cardHeightVh: height of card in vh units
 * Returns 0–100: 100 = fully hidden, 0 = fully revealed.
 */
export function cardClipPercent(
  progress: number,
  cardTopVh: number,
  cardHeightVh: number,
): number {
  const lineVh = lineTopVh(progress)
  const cardBottomVh = cardTopVh + cardHeightVh
  const wipeProgress = (cardBottomVh - lineVh) / cardHeightVh
  const clamped = Math.max(0, Math.min(1, wipeProgress))
  return Math.max(0, 100 - clamped * 100)
}

/** React hook: returns overall scroll progress 0–1 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}

/** React hook: returns card top and height in vh, updates on resize */
export function useCardRect(cardRef: React.RefObject<HTMLElement | null>): {
  topVh: number
  heightVh: number
} {
  const [rect, setRect] = useState({ topVh: 12, heightVh: 55 })

  useEffect(() => {
    function update() {
      if (!cardRef.current) return
      const r = cardRef.current.getBoundingClientRect()
      setRect({
        topVh: (r.top / window.innerHeight) * 100,
        heightVh: (r.height / window.innerHeight) * 100,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [cardRef])

  return rect
}
