import { sectionProgress, lineTopVh, cardClipPercent } from '../hooks/useScrollProgress'

describe('sectionProgress', () => {
  it('returns 0 when scroll is before the section phase', () => {
    expect(sectionProgress(0, 0, 3)).toBe(0)
    expect(sectionProgress(0, 1, 3)).toBe(0)
  })

  it('returns 1 when scroll is past the section phase', () => {
    expect(sectionProgress(1, 0, 3)).toBe(1)
    expect(sectionProgress(0.4, 0, 3)).toBe(1)
  })

  it('returns 0.5 at the midpoint of a phase', () => {
    // phase 0: 0→0.333, midpoint=0.167
    expect(sectionProgress(0.167, 0, 3)).toBeCloseTo(0.5, 1)
  })

  it('is independent between phases', () => {
    // phase 1: 0.333→0.666, midpoint=0.5
    expect(sectionProgress(0.5, 1, 3)).toBeCloseTo(0.5, 1)
    expect(sectionProgress(0.5, 0, 3)).toBe(1)
  })
})

describe('lineTopVh', () => {
  it('starts at 100 (bottom) and ends at 0 (top)', () => {
    expect(lineTopVh(0)).toBe(100)
    expect(lineTopVh(1)).toBe(0)
    expect(lineTopVh(0.5)).toBe(50)
  })
})

describe('cardClipPercent', () => {
  it('returns 100 (hidden) when progress is 0', () => {
    expect(cardClipPercent(0, 12, 55)).toBe(100)
  })

  it('returns 0 (fully revealed) when line has passed top of card', () => {
    expect(cardClipPercent(1, 12, 55)).toBe(0)
  })

  it('returns partial clip when line is mid-card', () => {
    // card top=12vh, height=55vh → bottom=67vh
    // line at 50vh → wipeProgress=(67-50)/55 ≈ 0.309
    // clipTop = 100 - 0.309*100 ≈ 69
    const result = cardClipPercent(0.5, 12, 55)
    expect(result).toBeGreaterThan(60)
    expect(result).toBeLessThan(80)
  })
})
