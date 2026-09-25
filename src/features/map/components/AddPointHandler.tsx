import { Marker, Popup } from 'react-leaflet'
import { useActiveField, type Field } from '@/features/fields'
import { PointForm, usePointsStore, type PointFormValues } from '@/features/points'
import { useAddPointFlow } from '../hooks/useAddPointFlow'
import { pendingPointIcon } from '../lib/icons'
import type { LatLng } from '@/shared/geo'

export function AddPointHandler() {
  const activeField = useActiveField()
  const addPoint = usePointsStore((state) => state.addPoint)
  const { pending, showOutsideWarning, cancel } = useAddPointFlow(activeField)

  if (!activeField) return null

  function handleSubmit(field: Field, point: LatLng, values: PointFormValues) {
    addPoint({
      fieldId: field.properties.id,
      fieldName: field.properties.name,
      lat: point.lat,
      lng: point.lng,
      ...values,
    })
    cancel()
  }

  return (
    <>
      {showOutsideWarning ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute top-4 left-1/2 z-[1000] -translate-x-1/2 rounded-md bg-amber-100 px-3 py-1.5 text-sm whitespace-nowrap text-amber-900 shadow"
        >
          Точку можна додати лише в межах вибраного поля
        </div>
      ) : null}
      {pending ? (
        <>
          <Marker position={pending} icon={pendingPointIcon} title="Нова точка" />
          <Popup
            position={pending}
            autoClose={false}
            eventHandlers={{ remove: cancel }}
          >
            <PointForm
              onSubmit={(values) => handleSubmit(activeField, pending, values)}
              onCancel={cancel}
            />
          </Popup>
        </>
      ) : null}
    </>
  )
}
