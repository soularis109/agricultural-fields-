import type { Feature, Polygon, Position } from 'geojson'
import type { LatLng } from './types'

function positionToLatLng(position: Position): LatLng {
  const [lng, lat] = position
  if (lng === undefined || lat === undefined) {
    throw new Error('Invalid GeoJSON position: expected [lng, lat]')
  }
  return { lat, lng }
}

export function geoJsonPolygonToLatLngs(field: Feature<Polygon>): LatLng[][] {
  return field.geometry.coordinates.map((ring) => ring.map(positionToLatLng))
}
