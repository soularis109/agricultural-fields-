import type { LatLng } from '@/shared/geo'

export interface PointDraft {
  fieldId: string
  point: LatLng
}

export function draftForField(draft: PointDraft | null, fieldId: string | undefined): LatLng | null {
  return draft !== null && draft.fieldId === fieldId ? draft.point : null
}