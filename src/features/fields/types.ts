import type { Feature, Polygon } from 'geojson'

export interface FieldProperties {
  id: string
  name: string
  crop: string
  area: number
}

export type Field = Feature<Polygon, FieldProperties>
