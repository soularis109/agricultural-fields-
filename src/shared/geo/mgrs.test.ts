import { describe, expect, it } from 'vitest'
import { toMgrs } from './mgrs'

describe('toMgrs', () => {
  // Reference value computed independently with the `geodesy` library
  // (Chris Veness, github.com/chrisveness/geodesy) — a separate implementation
  // from the `mgrs` (proj4js) package under test — for 50.4501°N, 30.5234°E:
  //   new LatLon(50.4501, 30.5234).toUtm().toMgrs().toString()
  //   -> '36U UA 24182 91607'
  it('converts a known WGS84 point to its MGRS grid reference', () => {
    expect(toMgrs({ lat: 50.4501, lng: 30.5234 })).toBe('36UUA2418291607')
  })

  it('returns null instead of throwing for an out-of-range latitude', () => {
    expect(toMgrs({ lat: 95, lng: 30.5234 })).toBeNull()
  })
})
