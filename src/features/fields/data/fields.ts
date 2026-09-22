import type { FeatureCollection, Polygon } from 'geojson'
import type { Field, FieldProperties } from '../types'

export const fields: FeatureCollection<Polygon, FieldProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'field-1', name: 'Поле №1 - Пшениця', crop: 'Пшениця', area: 45.2 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.5234, 50.4501],
            [30.5334, 50.4501],
            [30.5334, 50.4601],
            [30.5234, 50.4601],
            [30.5234, 50.4501],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'field-2', name: 'Поле №2 - Соняшник', crop: 'Соняшник', area: 38.7 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.5434, 50.4501],
            [30.5534, 50.4501],
            [30.5534, 50.4601],
            [30.5434, 50.4601],
            [30.5434, 50.4501],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'field-3', name: 'Поле №3 - Кукурудза', crop: 'Кукурудза', area: 52.4 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.5234, 50.4301],
            [30.5334, 50.4301],
            [30.5334, 50.4401],
            [30.5234, 50.4401],
            [30.5234, 50.4301],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 'field-4', name: 'Поле №4 - Ячмінь', crop: 'Ячмінь', area: 41.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30.5434, 50.4301],
            [30.5534, 50.4301],
            [30.5534, 50.4401],
            [30.5434, 50.4401],
            [30.5434, 50.4301],
          ],
        ],
      },
    },
  ],
}

export function getFieldById(id: string): Field | undefined {
  return fields.features.find((field) => field.properties.id === id)
}

export function getFirstField(): Field {
  const first = fields.features[0]
  if (!first) {
    throw new Error('Mock fields dataset is empty')
  }
  return first
}
