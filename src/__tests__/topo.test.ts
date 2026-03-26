import { organicPath, peakPaths } from '../utils/topo'

describe('organicPath', () => {
  it('returns a non-empty SVG path string starting with M', () => {
    const d = organicPath(100, 100, 50, [])
    expect(d).toMatch(/^M /)
    expect(d.endsWith('Z')).toBe(true)
  })

  it('produces a different path when harmonics are applied', () => {
    const plain = organicPath(100, 100, 50, [])
    const harmonic = organicPath(100, 100, 50, [[10, 3, 0]])
    expect(plain).not.toBe(harmonic)
  })

  it('scales with radius — larger r produces longer path string', () => {
    const small = organicPath(0, 0, 50, [])
    const large = organicPath(0, 0, 200, [])
    expect(large.length).toBeGreaterThan(small.length)
  })
})

describe('peakPaths', () => {
  it('returns an array of SVG path strings for each band', () => {
    const paths = peakPaths(500, 300, [80, 50, 25], [[10, 3, 0]])
    expect(paths).toHaveLength(3)
    paths.forEach(p => expect(p).toMatch(/^M /))
  })
})
