import type { MonitoringPoint, PointFilterState, SortOrder } from '../types'

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
