import L from 'leaflet'
import { Polygon, Tooltip } from 'react-leaflet'
import { geoJsonPolygonToLatLngs } from '@/shared/geo'
import type { Field } from '../types'

interface FieldPolygonProps {
  field: Field
  isActive: boolean
  onSelect?: (field: Field) => void
}

export function FieldPolygon({ field, isActive, onSelect }: FieldPolygonProps) {
  const positions = geoJsonPolygonToLatLngs(field)

  return (
    <Polygon
      positions={positions}
      pathOptions={
        isActive
          ? { color: '#059669', weight: 3, fillOpacity: 0.35 }
          : { color: '#64748b', weight: 1.5, fillOpacity: 0.1 }
      }
      eventHandlers={
        isActive || !onSelect
          ? undefined
          : {
              click: (event) => {
                L.DomEvent.stopPropagation(event)
                onSelect(field)
              },
            }
      }
    >
      <Tooltip sticky>{field.properties.name}</Tooltip>
    </Polygon>
  )
}
