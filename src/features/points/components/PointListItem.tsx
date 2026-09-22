import { memo } from 'react'
import { Button } from '../../../shared/ui'
import { usePointDisplay } from '../hooks/usePointDisplay'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

interface PointListItemProps {
  point: MonitoringPoint
}

export const PointListItem = memo(function PointListItem({ point }: PointListItemProps) {
  const removePoint = usePointsStore((state) => state.removePoint)
  const { typeLabel, coordsLabel, mgrsLabel, dateLabel } = usePointDisplay(point)

  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{typeLabel}</p>
        <p className="text-xs text-slate-500">{point.fieldName}</p>
        {point.description ? (
          <p className="mt-1 text-sm text-slate-700">{point.description}</p>
        ) : null}
        <p className="mt-1 text-xs text-slate-400">
          {coordsLabel} · MGRS: {mgrsLabel}
        </p>
        <p className="text-xs text-slate-400">{dateLabel}</p>
      </div>
      <Button variant="danger" onClick={() => removePoint(point.id)}>
        Видалити
      </Button>
    </li>
  )
})
