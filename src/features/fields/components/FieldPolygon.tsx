import { Polygon, Tooltip } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { geoJsonPolygonToLatLngs } from '../../../shared/geo'
import type { Field } from '../types'

interface FieldPolygonProps {
  field: Field
  isActive: boolean
}

export function FieldPolygon({ field, isActive }: FieldPolygonProps) {
  const navigate = useNavigate()
  const positions = geoJsonPolygonToLatLngs(field)

  return (
    <Polygon
      positions={positions}
      pathOptions={
        isActive
          ? { color: '#059669', weight: 3, fillOpacity: 0.35 }
          : { color: '#64748b', weight: 1.5, fillOpacity: 0.1 }
      }
      eventHandlers={{
        click: () => navigate(`/fields/${field.properties.id}`),
      }}
    >
      <Tooltip sticky>{field.properties.name}</Tooltip>
    </Polygon>
  )
}
