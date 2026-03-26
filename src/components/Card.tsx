import React from 'react'
import { sectionProgress, cardClipPercent } from '../hooks/useScrollProgress'

interface CardProps {
  scrollProgress: number
  cardRef: React.RefObject<HTMLDivElement | null>
  cardTopVh: number
  cardHeightVh: number
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
}

const NUM_SECTIONS = 3

export default function Card({
  scrollProgress,
  cardRef,
  cardTopVh,
  cardHeightVh,
  children,
}: CardProps) {
  const clips = [0, 1, 2].map(i => {
    const p = sectionProgress(scrollProgress, i, NUM_SECTIONS)
    return cardClipPercent(p, cardTopVh, cardHeightVh)
  })

  return (
    <div
      ref={cardRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden shadow-2xl"
      style={{
        width: 'min(92vw, 820px)',
        height: 'min(82vh, 400px)',
        background: 'rgba(253, 252, 249, 0.91)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderLeft: '2px solid #1a6b5a',
      }}
    >
      {/* Section 0: Hero — always visible base */}
      <div className="absolute inset-0">{children[0]}</div>

      {/* Sections 1–3: wipe in from bottom */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            clipPath: `inset(${clips[i].toFixed(1)}% 0 0 0)`,
            background: 'rgba(253, 252, 249, 0.97)',
            zIndex: i + 1,
          }}
        >
          {children[i + 1]}
        </div>
      ))}
    </div>
  )
}
