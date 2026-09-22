import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import type { Feature, Polygon } from 'geojson'
import type { LatLng } from './types'

export function isPointInField(point: LatLng, field: Feature<Polygon>): boolean {
  return booleanPointInPolygon([point.lng, point.lat], field)
}
