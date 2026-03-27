import React, { useCallback } from 'react'

interface CardProps {
  cardRef: React.RefObject<HTMLDivElement | null>
  clipRefs: React.RefObject<(HTMLDivElement | null)[]>
  children: [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode]
  overlay?: React.ReactNode
}

export default function Card({ cardRef, clipRefs, children, overlay }: CardProps) {
  const setClipRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      if (clipRefs.current) clipRefs.current[i] = el
    },
    [clipRefs],
  )

  return (
    <div
      ref={cardRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 overflow-hidden shadow-2xl"
      style={{
        width: 'min(92vw, 920px)',
        height: 'min(80vh, 460px)',
        background: 'rgba(253, 252, 249, 0.91)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderLeft: '2px solid #1a6b5a',
      }}
    >
      <div className="absolute inset-0">{children[0]}</div>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          ref={setClipRef(i)}
          className="absolute inset-0"
          style={{
            clipPath: 'inset(100% 0 0 0)',
            background: 'rgb(253, 252, 249)',
            zIndex: i + 1,
          }}
        >
          {children[i + 1]}
        </div>
      ))}
      {overlay && (
        <div className="absolute inset-0 z-50" style={{ background: 'rgb(253, 252, 249)' }}>
          {overlay}
        </div>
      )}
    </div>
  )
}
