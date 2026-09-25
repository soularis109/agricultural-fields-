import { MapContainer, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { fields, FieldPolygon, type Field } from '../../fields'
import { PointMarker, useVisiblePoints } from '../../points'
import { AddPointHandler } from './AddPointHandler'
import { FitActiveField } from './FitActiveField'

interface MapViewProps {
  activeField: Field | undefined
}

const MAP_CENTER: [number, number] = [50.445, 30.535]

export function MapView({ activeField }: MapViewProps) {
  const navigate = useNavigate()
  const visiblePoints = useVisiblePoints()

  return (
    <div className="relative h-full w-full">
      <MapContainer center={MAP_CENTER} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fields.features.map((field) => (
          <FieldPolygon
            key={field.properties.id}
            field={field}
            isActive={activeField?.properties.id === field.properties.id}
            onSelect={(selected) => navigate(`/fields/${selected.properties.id}`)}
          />
        ))}
        {visiblePoints.map((point) => (
          <PointMarker key={point.id} point={point} />
        ))}
        <FitActiveField field={activeField} />
        <AddPointHandler />
      </MapContainer>
    </div>
  )
}
