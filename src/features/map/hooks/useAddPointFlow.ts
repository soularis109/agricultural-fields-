import { useEffect, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import { isPointInField, type LatLng } from '../../../shared/geo'
import type { Field } from '../../fields'

const OUTSIDE_WARNING_DURATION_MS = 3000

interface UseAddPointFlowResult {
  pending: LatLng | null
  showOutsideWarning: boolean
  cancel: () => void
}

/**
 * Owns the "click on the map to place a point" state machine — extracted
 * out of AddPointHandler so that component is left with rendering only.
 */
export function useAddPointFlow(activeField: Field | undefined): UseAddPointFlowResult {
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
    const timer = setTimeout(() => setShowOutsideWarning(false), OUTSIDE_WARNING_DURATION_MS)
    return () => clearTimeout(timer)
  }, [showOutsideWarning])

  return { pending, showOutsideWarning, cancel: () => setPending(null) }
}
