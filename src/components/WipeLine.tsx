import React from 'react'

interface WipeLineProps {
  wipeLineRef: React.RefObject<HTMLDivElement | null>
  wipeLabelRef: React.RefObject<HTMLDivElement | null>
}

export default function WipeLine({ wipeLineRef, wipeLabelRef }: WipeLineProps) {
  return (
    <>
      <div
        ref={wipeLineRef}
        data-testid="wipe-line"
        className="fixed left-0 w-screen z-20 pointer-events-none"
        style={{ top: '100vh', height: '1px', background: 'var(--color-green-topo)', opacity: 0 }}
      />
      <div
        ref={wipeLabelRef}
        className="fixed z-20 pointer-events-none font-mono text-label tracking-wide uppercase"
        style={{ top: '100vh', left: '2vw', transform: 'translateY(6px)', color: 'var(--color-green-deep)', opacity: 0 }}
      />
    </>
  )
}
