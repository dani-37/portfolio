import { useEffect, useRef } from 'react'
import { PEAKS, peakPaths } from '../utils/topo'

export default function TopoBackground() {
  const groupRef = useRef<SVGGElement>(null)

  // Mouse parallax — very subtle, eased
  useEffect(() => {
    let mx = 0, my = 0, cx = 0, cy = 0
    let rafId: number

    function onMove(e: MouseEvent) {
      mx = (e.clientX / window.innerWidth - 0.5)
      my = (e.clientY / window.innerHeight - 0.5)
    }

    function tick() {
      cx += (mx - cx) * 0.025
      cy += (my - cy) * 0.025
      if (groupRef.current) {
        groupRef.current.style.transform =
          `translate(${(cx * 22).toFixed(2)}px, ${(cy * 14).toFixed(2)}px)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1440 900"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="topo-flow" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.007 0.005"
            numOctaves={4}
            seed={7}
            result="noise"
          >
            {/* Only animate baseFrequency — seed animation causes visible snapping */}
            <animate
              attributeName="baseFrequency"
              values="0.007 0.005; 0.010 0.007; 0.007 0.005"
              dur="14s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <rect width="1440" height="900" fill="#e6f0ed" />

      <g
        id="contours"
        ref={groupRef}
        filter={typeof window !== 'undefined' && window.innerWidth >= 768 ? 'url(#topo-flow)' : undefined}
        stroke="#2d5a52"
        fill="none"
        strokeWidth={0.9}
      >
        {PEAKS.map((peak, pi) => {
          const paths = peakPaths(peak.cx, peak.cy, peak.bands, peak.harmonics)
          const [minO, maxO] = peak.opacityRange
          return paths.map((d, bi) => {
            const opacity = paths.length > 1 ? minO + (bi / (paths.length - 1)) * (maxO - minO) : minO
            return (
              <path
                key={`${pi}-${bi}`}
                d={d}
                opacity={opacity.toFixed(2)}
              />
            )
          })
        })}
      </g>
    </svg>
  )
}
