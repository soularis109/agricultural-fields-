import { forward } from 'mgrs'
import type { LatLng } from './types'

export function toMgrs(point: LatLng): string | null {
  try {
    return forward([point.lng, point.lat])
  } catch {
    return null
  }
}
