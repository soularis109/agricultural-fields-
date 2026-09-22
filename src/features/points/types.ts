export type PointType = 'soil-sample' | 'pests' | 'disease' | 'other'

export interface MonitoringPoint {
  id: string
  fieldId: string
  fieldName: string
  lat: number
  lng: number
  type: PointType
  description?: string
  createdAt: string
}

export type SortOrder = 'newest' | 'oldest'

export interface PointFilterState {
  type: PointType | 'all'
  search: string
  sortOrder: SortOrder
}
