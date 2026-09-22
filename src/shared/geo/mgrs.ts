import { forward } from 'mgrs'
import type { LatLng } from './types'

/**
 * WGS84 -> MGRS grid reference.
 *
 * `mgrs` (like GeoJSON/turf) expects coordinates as [longitude, latitude] — the
 * opposite order of our own `LatLng` — so the swap happens here, once, in the
 * single place coordinate order is allowed to matter.
 *
 * `forward()` doesn't validate latitude/longitude ranges for every malformed
 * input (e.g. NaN silently produces a garbage string), but it does throw for
 * out-of-range values; the try/catch turns that into a `null` the UI can
 * render as a fallback instead of crashing.
 */
export function toMgrs(point: LatLng): string | null {
  try {
    return forward([point.lng, point.lat])
  } catch {
    return null
  }
}
