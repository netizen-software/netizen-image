import { describe, expect, it } from 'vitest'
import { clampZoom, MAX_ZOOM, MIN_ZOOM } from '../../src/renderer/lib/zoom'

describe('clampZoom', () => {
  it('changes zoom in fixed increments', () => {
    expect(clampZoom(1, 'in')).toBe(1.1)
    expect(clampZoom(1, 'out')).toBe(0.9)
  })

  it('does not exceed the maximum zoom', () => {
    expect(clampZoom(MAX_ZOOM, 'in')).toBe(MAX_ZOOM)
  })

  it('does not go below the minimum zoom', () => {
    expect(clampZoom(MIN_ZOOM, 'out')).toBe(MIN_ZOOM)
  })
})
