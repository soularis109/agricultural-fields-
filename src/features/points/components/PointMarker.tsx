import { memo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Button } from '@/shared/ui'
import { getPointDisplay } from '../lib/pointDisplay'
import { getPointIcon } from '../lib/icons'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

interface PointMarkerProps {
  point: MonitoringPoint
}

export const PointMarker = memo(function PointMarker({ point }: PointMarkerProps) {
  const removePoint = usePointsStore((state) => state.removePoint)
  const { typeLabel, coordsLabel, mgrsLabel, dateLabel } = getPointDisplay(point)

  return (
    <Marker
      position={{ lat: point.lat, lng: point.lng }}
      icon={getPointIcon(point.type)}
      title={typeLabel}
    >
      <Popup>
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-medium">{typeLabel}</p>
          <p className="text-slate-600">{point.fieldName}</p>
          {point.description ? <p>{point.description}</p> : null}
          <p className="text-xs text-slate-500">{coordsLabel}</p>
          <p className="text-xs text-slate-500">MGRS: {mgrsLabel}</p>
          <p className="text-xs text-slate-400">{dateLabel}</p>
          <Button variant="danger" onClick={() => removePoint(point.id)}>
            Видалити
          </Button>
        </div>
      </Popup>
    </Marker>
  )
})
