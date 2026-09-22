import { useMemo } from 'react'
import { filterPoints, sortPoints } from '../lib/points'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

/**
 * The derived, visible list — feeds both the sidebar list and the map
 * markers. Selectors below return the store's own references (no
 * `.filter()`/`.sort()` inside a selector); the derivation happens here,
 * in `useMemo`, which is the safe place for it.
 */
export function useVisiblePoints(): MonitoringPoint[] {
  const points = usePointsStore((state) => state.points)
  const filters = usePointsStore((state) => state.filters)

  return useMemo(() => {
    const filtered = filterPoints(points, filters)
    return sortPoints(filtered, filters.sortOrder)
  }, [points, filters])
}
