import { toMgrs } from '../../../shared/geo'
import { formatDate } from '../../../shared/lib'
import { POINT_TYPE_LABELS } from '../lib/pointTypes'
import type { MonitoringPoint } from '../types'

interface PointDisplay {
  typeLabel: string
  coordsLabel: string
  mgrsLabel: string
  dateLabel: string
}

/**
 * Shared formatting for a point's type/coords/MGRS/date — used by both
 * PointListItem and PointMarker, which render the same data in different
 * layouts (sidebar row vs. map popup).
 */
export function usePointDisplay(point: MonitoringPoint): PointDisplay {
  const mgrs = toMgrs({ lat: point.lat, lng: point.lng })

  return {
    typeLabel: POINT_TYPE_LABELS[point.type],
    coordsLabel: `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`,
    mgrsLabel: mgrs ?? 'н/д',
    dateLabel: formatDate(point.createdAt),
  }
}
