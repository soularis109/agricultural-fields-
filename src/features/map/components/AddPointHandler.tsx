import L from 'leaflet'
import { useEffect, useState } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { isPointInField, type LatLng } from '../../../shared/geo'
import { useActiveField } from '../../fields'
import { PointForm, usePointsStore } from '../../points'

const pendingIcon = L.divIcon({
  className: '',
  html: '<span class="block h-4 w-4 rounded-full border-2 border-dashed border-emerald-600 bg-white"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

/**
 * Composes `fields` (active field + geometry) and `points` (addPoint) —
 * neither of those features imports the other; this is where they meet.
 */
export function AddPointHandler() {
  const activeField = useActiveField()
  const addPoint = usePointsStore((state) => state.addPoint)
  const [pending, setPending] = useState<LatLng | null>(null)
  const [showOutsideWarning, setShowOutsideWarning] = useState(false)

  useMapEvents({
    click(event) {
      if (!activeField) return
      const point: LatLng = { lat: event.latlng.lat, lng: event.latlng.lng }
      if (isPointInField(point, activeField)) {
        setShowOutsideWarning(false)
        setPending(point)
      } else {
        setPending(null)
        setShowOutsideWarning(true)
      }
    },
  })

  useEffect(() => {
    if (!showOutsideWarning) return
    const timer = setTimeout(() => setShowOutsideWarning(false), 3000)
    return () => clearTimeout(timer)
  }, [showOutsideWarning])

  if (!activeField) return null

  return (
    <>
      {showOutsideWarning ? (
        <div className="pointer-events-none absolute top-4 left-1/2 z-[1000] -translate-x-1/2 rounded-md bg-amber-100 px-3 py-1.5 text-sm whitespace-nowrap text-amber-900 shadow">
          Точку можна додати лише в межах вибраного поля
        </div>
      ) : null}
      {pending ? (
        <>
          <Marker position={pending} icon={pendingIcon} />
          {/* Standalone (not nested in <Marker>) so it opens immediately —
              a popup nested in a Marker only opens when the marker is clicked. */}
          <Popup
            position={pending}
            autoClose={false}
            eventHandlers={{ remove: () => setPending(null) }}
          >
            <PointForm
              onSubmit={(values) => {
                addPoint({
                  fieldId: activeField.properties.id,
                  fieldName: activeField.properties.name,
                  lat: pending.lat,
                  lng: pending.lng,
                  ...values,
                })
                setPending(null)
              }}
              onCancel={() => setPending(null)}
            />
          </Popup>
        </>
      ) : null}
    </>
  )
}
