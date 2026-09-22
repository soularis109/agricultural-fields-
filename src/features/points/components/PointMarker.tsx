import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import { toMgrs } from '../../../shared/geo'
import { formatDate } from '../../../shared/lib'
import { Button } from '../../../shared/ui'
import { POINT_TYPE_COLORS, POINT_TYPE_LABELS } from '../lib/pointTypes'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

function createIcon(type: MonitoringPoint['type']) {
  return L.divIcon({
    className: '',
    html: `<span style="background:${POINT_TYPE_COLORS[type]}" class="block h-3.5 w-3.5 rounded-full border-2 border-white shadow"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

interface PointMarkerProps {
  point: MonitoringPoint
}

export function PointMarker({ point }: PointMarkerProps) {
  const removePoint = usePointsStore((state) => state.removePoint)
  const mgrs = toMgrs({ lat: point.lat, lng: point.lng })

  return (
    <Marker position={{ lat: point.lat, lng: point.lng }} icon={createIcon(point.type)}>
      <Popup>
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-medium">{POINT_TYPE_LABELS[point.type]}</p>
          <p className="text-slate-600">{point.fieldName}</p>
          {point.description ? <p>{point.description}</p> : null}
          <p className="text-xs text-slate-500">
            {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
          </p>
          <p className="text-xs text-slate-500">MGRS: {mgrs ?? 'н/д'}</p>
          <p className="text-xs text-slate-400">{formatDate(point.createdAt)}</p>
          <Button variant="danger" onClick={() => removePoint(point.id)}>
            Видалити
          </Button>
        </div>
      </Popup>
    </Marker>
  )
}
