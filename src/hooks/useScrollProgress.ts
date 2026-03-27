import { useEffect, useRef } from 'react'

export function sectionProgress(
  scrollP: number,
  sectionIndex: number,
  numSections: number,
): number {
  const phase = 1 / numSections
  const start = sectionIndex * phase
  return Math.max(0, Math.min(1, (scrollP - start) * numSections))
}

export function lineTopVh(progress: number): number {
  return 100 - progress * 100
}

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

/**
 * Drives all scroll animations via direct DOM writes — zero React re-renders.
 * Card clip-paths, wipe line, and scroll hint are all updated through refs.
 */
export function useScrollLayout(opts: {
  cardRef: React.RefObject<HTMLElement | null>
  clipRefs: React.RefObject<(HTMLDivElement | null)[]>
  wipeLineRef: React.RefObject<HTMLDivElement | null>
  wipeLabelRef: React.RefObject<HTMLDivElement | null>
  hintRef: React.RefObject<HTMLDivElement | null>
  navRef: React.RefObject<HTMLDivElement | null>
  labels: string[]
  enabled: boolean
}) {
  const { cardRef, clipRefs, wipeLineRef, wipeLabelRef, hintRef, navRef, labels, enabled } = opts
  // Cache card rect — only changes on resize, not scroll
  const cardRect = useRef({ topVh: 12, heightVh: 55 })

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || window.innerWidth < 768) return

    function updateRect() {
      const el = cardRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      cardRect.current = {
        topVh: (r.top / window.innerHeight) * 100,
        heightVh: (r.height / window.innerHeight) * 100,
      }
    }
    updateRect()
    window.addEventListener('resize', updateRect)

    let rafId = 0
    let lastNavSection = 0
    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(tick)
    }

    function tick() {
      rafId = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const scrollP = scrollable > 0 ? window.scrollY / scrollable : 0
      const { topVh, heightVh } = cardRect.current
      const clips = clipRefs.current
      const numClips = clips ? clips.length : 0

      // Update clip-paths
      if (clips) {
        for (let i = 0; i < numClips; i++) {
          const el = clips[i]
          if (!el) continue
          const p = sectionProgress(scrollP, i, numClips)
          const clip = cardClipPercent(p, topVh, heightVh)
          el.style.clipPath = `inset(${clip.toFixed(1)}% 0 0 0)`
        }
      }

      // Wipe line + label
      let activeIdx = -1, activeP = 0
      for (let i = 0; i < numClips; i++) {
        const p = sectionProgress(scrollP, i, numClips)
        if (p > 0 && p < 1) { activeIdx = i; activeP = p; break }
      }
      const wipeTop = lineTopVh(activeP)
      const isActive = activeIdx !== -1

      const line = wipeLineRef.current
      if (line) {
        line.style.top = `${wipeTop}vh`
        line.style.opacity = isActive ? '0.4' : '0'
      }
      const label = wipeLabelRef.current
      if (label) {
        label.style.top = `${wipeTop}vh`
        label.style.opacity = isActive ? '0.7' : '0'
        label.textContent = isActive ? labels[activeIdx] : ''
      }

      // Scroll hint
      const hint = hintRef.current
      if (hint) {
        hint.style.opacity = scrollP > 0.04 ? '0' : '0.7'
      }

      // Nav indicator — switches when a section covers >60% of card,
      // otherwise holds the previous selection
      const nav = navRef.current
      if (nav) {
        const numSections = numClips + 1
        const progresses: number[] = []
        for (let i = 0; i < numClips; i++) {
          progresses.push(sectionProgress(scrollP, i, numClips))
        }

        for (let i = 0; i < numSections; i++) {
          let vis: number
          if (i === 0) {
            vis = 1 - (progresses[0] ?? 0)
          } else if (i < numSections - 1) {
            const prev = progresses[i - 1] ?? 0
            const curr = progresses[i] ?? 0
            vis = Math.min(prev, 1) - curr
          } else {
            vis = progresses[i - 1] ?? 0
          }
          vis = Math.max(0, Math.min(1, vis))
          if (vis >= 0.6) lastNavSection = i
        }

        const groups = nav.children
        for (let i = 0; i < groups.length; i++) {
          const bar = (groups[i] as HTMLElement).lastElementChild as HTMLElement
          if (!bar) continue
          if (i === lastNavSection) {
            bar.style.width = '32px'
            bar.style.background = '#1a6b5a'
          } else {
            bar.style.width = '20px'
            bar.style.background = '#9aaba3'
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    tick() // initial paint
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateRect)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [cardRef, clipRefs, wipeLineRef, wipeLabelRef, hintRef, navRef, labels, enabled])
}
