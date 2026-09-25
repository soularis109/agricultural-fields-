import { useEffect, useState } from 'react'
import { useMapEvents } from 'react-leaflet'
import { isPointInField, type LatLng } from '../../../shared/geo'
import type { Field } from '../../fields'
import { draftForField, type PointDraft } from '../lib/pointDraft'

const OUTSIDE_WARNING_DURATION_MS = 3000

interface UseAddPointFlowResult {
  pending: LatLng | null
  showOutsideWarning: boolean
  cancel: () => void
}

export function useAddPointFlow(activeField: Field | undefined): UseAddPointFlowResult {
  const [draft, setDraft] = useState<PointDraft | null>(null)
  const [showOutsideWarning, setShowOutsideWarning] = useState(false)
  const pending = draftForField(draft, activeField?.properties.id)

  useMapEvents({
    click(event) {
      if (!activeField) return
      const point: LatLng = { lat: event.latlng.lat, lng: event.latlng.lng }
      if (isPointInField(point, activeField)) {
        setShowOutsideWarning(false)
        setDraft({ fieldId: activeField.properties.id, point })
      } else {
        setDraft(null)
        setShowOutsideWarning(true)
      }
    },
  })

  useEffect(() => {
    if (!showOutsideWarning) return
    const timer = setTimeout(() => setShowOutsideWarning(false), OUTSIDE_WARNING_DURATION_MS)
    return () => clearTimeout(timer)
  }, [showOutsideWarning])

  return { pending, showOutsideWarning, cancel: () => setDraft(null) }
}