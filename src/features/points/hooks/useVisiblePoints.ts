import { useMemo } from 'react'
import { filterPoints, sortPoints } from '../lib/points'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

export function useVisiblePoints(): MonitoringPoint[] {
  const points = usePointsStore((state) => state.points)
  const filters = usePointsStore((state) => state.filters)

  return useMemo(() => {
    const filtered = filterPoints(points, filters)
    return sortPoints(filtered, filters.sortOrder)
  }, [points, filters])
}
