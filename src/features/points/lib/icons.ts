import L from 'leaflet'
import { POINT_TYPE_COLORS } from './pointTypes'
import type { PointType } from '../types'

export function createPointIcon(type: PointType) {
  return L.divIcon({
    className: '',
    html: `<span style="background:${POINT_TYPE_COLORS[type]}" class="block h-3.5 w-3.5 rounded-full border-2 border-white shadow"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}
