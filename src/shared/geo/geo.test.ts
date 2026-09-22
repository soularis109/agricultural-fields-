import { describe, expect, it } from 'vitest'
import type { Feature, Polygon } from 'geojson'
import { isPointInField } from './pointInPolygon'

const field1: Feature<Polygon, { id: string; name: string }> = {
  type: 'Feature',
  properties: { id: 'field-1', name: 'Поле №1 - Пшениця' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [30.5234, 50.4501],
        [30.5334, 50.4501],
        [30.5334, 50.4601],
        [30.5234, 50.4601],
        [30.5234, 50.4501],
      ],
    ],
  },
}

describe('isPointInField', () => {
  it('returns true for a point inside the polygon', () => {
    expect(isPointInField({ lat: 50.4551, lng: 30.5284 }, field1)).toBe(true)
  })

  it('returns false for a point outside the polygon', () => {
    expect(isPointInField({ lat: 50.47, lng: 30.55 }, field1)).toBe(false)
  })
})
