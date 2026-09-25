import { describe, expect, it } from 'vitest'
import type { Feature, Polygon } from 'geojson'
import { fieldAreaHectares, formatFieldArea } from './area'

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

describe('fieldAreaHectares', () => {
  it('computes the area of a field from its geometry', () => {
    expect(fieldAreaHectares(field1)).toBeCloseTo(78.72, 1)
  })
})

describe('formatFieldArea', () => {
  it('formats the area with one decimal and the "га" unit', () => {
    expect(formatFieldArea(field1)).toBe('78.7 га')
  })
})