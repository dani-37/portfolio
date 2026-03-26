/** One harmonic perturbation term: [amplitude, frequency, phase] */
export type Harmonic = [number, number, number]

/**
 * Generate an organic closed SVG path centered at (cx, cy) with base radius r.
 * Harmonics add sine-wave perturbations for terrain-like irregularity.
 * Uses Catmull-Rom → cubic bezier for smooth curves.
 */
export function organicPath(
  cx: number,
  cy: number,
  r: number,
  harmonics: Harmonic[],
  n = 120,
): string {
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    let rad = r
    for (const [amp, freq, phase] of harmonics) {
      rad += amp * Math.sin(freq * t + phase)
    }
    pts.push([cx + rad * Math.cos(t), cy + rad * Math.sin(t)])
  }

  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n, i + 2)]
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + ' Z'
}

/**
 * Generate all contour band paths for one topographic peak.
 * bands: array of radii from outermost to innermost.
 * Outer bands use scaled-down harmonics for smoother edges.
 */
export function peakPaths(
  cx: number,
  cy: number,
  bands: number[],
  harmonics: Harmonic[],
): string[] {
  return bands.map((r, i) => {
    const scale = 1 - (i / bands.length) * 0.4
    const scaled: Harmonic[] = harmonics.map(([a, f, p]) => [a * scale, f, p])
    return organicPath(cx, cy, r, scaled)
  })
}

/** The three peaks used in the portfolio background */
export const PEAKS: Array<{
  cx: number
  cy: number
  bands: number[]
  harmonics: Harmonic[]
  opacityRange: [number, number]
}> = [
  {
    cx: 1080, cy: 160,
    bands: [560, 450, 345, 255, 178, 115, 65, 30],
    harmonics: [[55, 2, 0.4], [38, 3, 1.2], [22, 5, 2.1], [15, 7, 0.8], [8, 11, 3.0]],
    opacityRange: [0.18, 0.40],
  },
  {
    cx: 310, cy: 760,
    bands: [480, 375, 278, 195, 128, 72, 35],
    harmonics: [[70, 2, 1.8], [42, 3, 0.5], [28, 4, 2.6], [18, 6, 1.1], [10, 9, 0.3]],
    opacityRange: [0.16, 0.36],
  },
  {
    cx: 1260, cy: 650,
    bands: [300, 220, 155, 100, 55, 24],
    harmonics: [[40, 2, 3.0], [25, 3, 0.9], [15, 5, 1.7], [8, 7, 2.4]],
    opacityRange: [0.14, 0.32],
  },
]
