import type { MonitoringPoint, PointFilterState, SortOrder } from '../types'
import { isPointType } from './pointTypes'

export const SORT_ORDERS = ['newest', 'oldest'] as const satisfies readonly SortOrder[]

export function isSortOrder(value: string): value is SortOrder {
  return (SORT_ORDERS as readonly string[]).includes(value)
}

export function filterPoints(
  points: MonitoringPoint[],
  filters: Pick<PointFilterState, 'type' | 'search'>,
): MonitoringPoint[] {
  const search = filters.search.trim().toLowerCase()

  return points.filter((point) => {
    const matchesType = filters.type === 'all' || point.type === filters.type
    const matchesSearch =
      search === '' || (point.description ?? '').toLowerCase().includes(search)
    return matchesType && matchesSearch
  })
}

export function sortPoints(
  points: MonitoringPoint[],
  sortOrder: PointFilterState['sortOrder'],
): MonitoringPoint[] {
  const sorted = [...points].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  return sortOrder === 'newest' ? sorted.reverse() : sorted
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isMonitoringPoint(value: unknown): value is MonitoringPoint {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.fieldId === 'string' &&
    typeof value.fieldName === 'string' &&
    typeof value.lat === 'number' &&
    typeof value.lng === 'number' &&
    typeof value.type === 'string' &&
    isPointType(value.type) &&
    (value.description === undefined || typeof value.description === 'string') &&
    typeof value.createdAt === 'string'
  )
}

export function restorePoints(persisted: unknown): MonitoringPoint[] {
  if (!isRecord(persisted) || !Array.isArray(persisted.points)) return []
  return persisted.points.filter(isMonitoringPoint)
}
