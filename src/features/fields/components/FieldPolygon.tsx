import L from 'leaflet'
import { Polygon, Tooltip } from 'react-leaflet'
import { geoJsonPolygonToLatLngs } from '../../../shared/geo'
import type { Field } from '../types'

interface FieldPolygonProps {
  field: Field
  isActive: boolean
  /** Called on a click of a non-active polygon — the caller decides what
   *  "selecting" a field means (routing lives outside this domain component). */
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
          ? undefined // let the click bubble to the map so AddPointHandler can open the add-point form
          : {
              // Path layers bubble their click to the map by default, which
              // would also fire AddPointHandler's map-click (evaluated
              // against the still-active field) and flash the "outside the
              // field" warning when a user is really just switching fields.
              // Only suppress that for a click on a *different* field's
              // polygon — the active field's own polygon is exactly where
              // adding a point is supposed to work.
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
