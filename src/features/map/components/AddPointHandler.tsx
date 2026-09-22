import { Marker, Popup } from 'react-leaflet'
import { useActiveField } from '../../fields'
import { PointForm, usePointsStore } from '../../points'
import { useAddPointFlow } from '../hooks/useAddPointFlow'
import { pendingPointIcon } from '../lib/icons'

export function AddPointHandler() {
  const activeField = useActiveField()
  const addPoint = usePointsStore((state) => state.addPoint)
  const { pending, showOutsideWarning, cancel } = useAddPointFlow(activeField)

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
          <Marker position={pending} icon={pendingPointIcon} />
          <Popup position={pending} autoClose={false} eventHandlers={{ remove: cancel }}>
            <PointForm
              onSubmit={(values) => {
                addPoint({
                  fieldId: activeField.properties.id,
                  fieldName: activeField.properties.name,
                  lat: pending.lat,
                  lng: pending.lng,
                  ...values,
                })
                cancel()
              }}
              onCancel={cancel}
            />
          </Popup>
        </>
      ) : null}
    </>
  )
}
