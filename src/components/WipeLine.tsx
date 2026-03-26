import { lineTopVh } from '../hooks/useScrollProgress'

interface WipeLineProps {
  /** Progress 0–1 for each wipe section (3 values) */
  sectionProgresses: [number, number, number]
  sectionLabels: [string, string, string]
}

export default function WipeLine({ sectionProgresses, sectionLabels }: WipeLineProps) {
  // Find the active wipe: in progress means 0 < p < 1
  const activeIndex = sectionProgresses.findIndex(p => p > 0 && p < 1)
  const isActive = activeIndex !== -1
  const progress = isActive ? sectionProgresses[activeIndex] : 0
  const topVh = lineTopVh(progress)

  return (
    <>
      {/* Full-width wipe line */}
      <div
        data-testid="wipe-line"
        className="fixed left-0 w-screen z-20 pointer-events-none"
        style={{
          top: `${topVh}vh`,
          height: '1px',
          background: '#2d5a52',
          opacity: isActive ? 0.4 : 0,
        }}
      />

      {/* Section label — floats just above the line, left of card */}
      {isActive && (
        <div
          className="fixed z-20 pointer-events-none font-mono text-[8px] tracking-[3px] uppercase"
          style={{
            top: `${topVh}vh`,
            left: '2vw',
            transform: 'translateY(-50%)',
            color: '#1a6b5a',
            opacity: 0.7,
          }}
        >
          {sectionLabels[activeIndex]}
        </div>
      )}
    </>
  )
}
