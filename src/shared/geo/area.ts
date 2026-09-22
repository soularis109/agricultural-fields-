import area from '@turf/area'
import type { Feature, Polygon } from 'geojson'

const SQUARE_METERS_PER_HECTARE = 10_000

export function fieldAreaHectares(field: Feature<Polygon>): number {
  return area(field) / SQUARE_METERS_PER_HECTARE
}

export function formatFieldArea(field: Feature<Polygon>): string {
  return `${fieldAreaHectares(field).toFixed(1)} га`
}
