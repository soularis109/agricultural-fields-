import L from 'leaflet'

/** The marker shown at a not-yet-submitted point while the add-point form is open. */
export const pendingPointIcon = L.divIcon({
  className: '',
  html: '<span class="block h-4 w-4 rounded-full border-2 border-dashed border-emerald-600 bg-white"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})
