import { toMgrs } from '../../../shared/geo'
import { formatDate } from '../../../shared/lib'
import { Button } from '../../../shared/ui'
import { POINT_TYPE_LABELS } from '../lib/pointTypes'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

interface PointListItemProps {
  point: MonitoringPoint
}

export function PointListItem({ point }: PointListItemProps) {
  const removePoint = usePointsStore((state) => state.removePoint)
  const mgrs = toMgrs({ lat: point.lat, lng: point.lng })

  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{POINT_TYPE_LABELS[point.type]}</p>
        <p className="text-xs text-slate-500">{point.fieldName}</p>
        {point.description ? (
          <p className="mt-1 text-sm text-slate-700">{point.description}</p>
        ) : null}
        <p className="mt-1 text-xs text-slate-400">
          {point.lat.toFixed(5)}, {point.lng.toFixed(5)} · MGRS: {mgrs ?? 'н/д'}
        </p>
        <p className="text-xs text-slate-400">{formatDate(point.createdAt)}</p>
      </div>
      <Button variant="danger" onClick={() => removePoint(point.id)}>
        Видалити
      </Button>
    </li>
  )
}
