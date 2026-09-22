import L from 'leaflet'
import { POINT_TYPE_COLORS, POINT_TYPE_GLYPHS } from './pointTypes'
import type { PointType } from '../types'

export function createPointIcon(type: PointType) {
  return L.divIcon({
    className: '',
    html: `<span style="background:${POINT_TYPE_COLORS[type]}" class="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] leading-none shadow">${POINT_TYPE_GLYPHS[type]}</span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}
