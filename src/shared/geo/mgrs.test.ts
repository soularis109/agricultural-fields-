import { describe, expect, it } from 'vitest'
import { toMgrs } from './mgrs'

describe('toMgrs', () => {
  it('converts a known WGS84 point to its MGRS grid reference', () => {
    expect(toMgrs({ lat: 50.4501, lng: 30.5234 })).toBe('36UUA2418291607')
  })

  it('returns null instead of throwing for an out-of-range latitude', () => {
    expect(toMgrs({ lat: 95, lng: 30.5234 })).toBeNull()
  })
})
