import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { Field } from '@/features/fields'
import { geoJsonPolygonToLatLngs } from '@/shared/geo'

interface FitActiveFieldProps {
  field: Field | undefined
}

export function FitActiveField({ field }: FitActiveFieldProps) {
  const map = useMap()

  useEffect(() => {
    if (!field) return
    const [outerRing] = geoJsonPolygonToLatLngs(field)
    if (!outerRing) return
    const bounds = L.latLngBounds(outerRing)
    if (!map.getBounds().contains(bounds)) {
      map.flyToBounds(bounds, { padding: [32, 32], maxZoom: 15 })
    }
  }, [map, field])

  return null
}