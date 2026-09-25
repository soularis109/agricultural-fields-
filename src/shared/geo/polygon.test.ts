import { describe, expect, it } from 'vitest'
import type { Feature, Polygon } from 'geojson'
import { geoJsonPolygonToLatLngs } from './polygon'

describe('geoJsonPolygonToLatLngs', () => {
  it('converts [lng, lat] GeoJSON positions to {lat, lng}', () => {
    const field: Feature<Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.5234, 50.4501],
            [30.5334, 50.4501],
            [30.5334, 50.4601],
          ],
        ],
      },
    }

    expect(geoJsonPolygonToLatLngs(field)).toEqual([
      [
        { lat: 50.4501, lng: 30.5234 },
        { lat: 50.4501, lng: 30.5334 },
        { lat: 50.4601, lng: 30.5334 },
      ],
    ])
  })

  it('throws for a position missing a coordinate', () => {
    const field = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [[[30.5234]]] },
    } as unknown as Feature<Polygon>

    expect(() => geoJsonPolygonToLatLngs(field)).toThrow('Invalid GeoJSON position')
  })
})