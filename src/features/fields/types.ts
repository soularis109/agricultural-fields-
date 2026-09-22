import type { Feature, Polygon } from 'geojson'

export interface FieldProperties {
  id: string
  name: string
  crop: string
  /**
   * Raw hectare value as given in the assignment's sample data.
   * Not used for display — see shared/geo/area.ts and the README for why.
   */
  area: number
}

export type Field = Feature<Polygon, FieldProperties>
