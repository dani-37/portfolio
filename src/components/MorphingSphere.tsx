import { useRef, useEffect } from 'react'

const LAT = 22
const LON = 30
const STEPS_LAT = 80
const STEPS_LON = 56

function distortedR(R: number, phi: number, theta: number, t: number): number {
  return (
    R *
    (1 +
      0.28 * Math.sin(2 * phi + t * 0.5) * Math.sin(theta + t * 0.35) +
      0.18 * Math.sin(3 * phi - theta + t * 0.42) +
      0.11 * Math.cos(phi + 2 * theta - t * 0.28) +
      0.07 * Math.sin(4 * phi + 3 * theta + t * 0.18))
  )
}

function getPoint(
  phi: number,
  theta: number,
  t: number,
  R: number,
  rotY: number,
  rotX: number,
): { x: number; y: number; z: number } {
  const r = distortedR(R, phi, theta, t)
  let x = r * Math.sin(phi) * Math.cos(theta)
  let y = r * Math.cos(phi)
  let z = r * Math.sin(phi) * Math.sin(theta)

  // Rotate around Y
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY)
  const xr = x * cosY + z * sinY
  z = -x * sinY + z * cosY
  x = xr

  // Slight tilt around X
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX)
  const yr = y * cosX - z * sinX
  z = y * sinX + z * cosX
  y = yr

  return { x, y, z }
}

export default function MorphingSphere({
  size,
  className,
}: {
  size: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const R = size * 0.38
    const cx = size / 2
    const cy = size / 2
    const start = performance.now()
    let animId: number

    function draw() {
      const t = (performance.now() - start) / 1000
      ctx.clearRect(0, 0, size, size)

      const rotY = t * 0.10   // slow rotation
      const rotX = 0.28       // fixed slight tilt for depth

      ctx.lineWidth = 0.65
      ctx.strokeStyle = '#1a6b5a'

      // Latitude rings
      for (let i = 0; i <= LAT; i++) {
        const phi = (i / LAT) * Math.PI
        const pts: { x: number; y: number; z: number }[] = []
        for (let j = 0; j <= STEPS_LAT; j++) {
          pts.push(getPoint(phi, (j / STEPS_LAT) * Math.PI * 2, t, R, rotY, rotX))
        }
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length
        ctx.globalAlpha = 0.08 + 0.26 * ((avgZ / R + 1) / 2)
        ctx.beginPath()
        ctx.moveTo(cx + pts[0].x, cy - pts[0].y)
        for (let k = 1; k < pts.length; k++) ctx.lineTo(cx + pts[k].x, cy - pts[k].y)
        ctx.stroke()
      }

      // Longitude lines
      for (let j = 0; j < LON; j++) {
        const theta = (j / LON) * Math.PI * 2
        const pts: { x: number; y: number; z: number }[] = []
        for (let i = 0; i <= STEPS_LON; i++) {
          pts.push(getPoint((i / STEPS_LON) * Math.PI, theta, t, R, rotY, rotX))
        }
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length
        ctx.globalAlpha = 0.08 + 0.26 * ((avgZ / R + 1) / 2)
        ctx.beginPath()
        ctx.moveTo(cx + pts[0].x, cy - pts[0].y)
        for (let k = 1; k < pts.length; k++) ctx.lineTo(cx + pts[k].x, cy - pts[k].y)
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
    />
  )
}
