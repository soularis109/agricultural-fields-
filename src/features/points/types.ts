export type PointType = 'soil-sample' | 'pests' | 'disease' | 'other'

export interface MonitoringPoint {
  id: string
  fieldId: string
  /** Denormalized at creation time so this feature never has to import `fields`. */
  fieldName: string
  lat: number
  lng: number
  type: PointType
  description?: string
  /** ISO 8601 string — persist middleware serializes to JSON, so a Date would
   *  degrade to a string on rehydrate anyway; better to be explicit. */
  createdAt: string
}

export type SortOrder = 'newest' | 'oldest'

/** Named distinctly from the `PointFilters` component (the filter bar UI). */
export interface PointFilterState {
  type: PointType | 'all'
  search: string
  sortOrder: SortOrder
}
