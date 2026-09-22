import type { PointType } from '../types'

export const POINT_TYPES = ['soil-sample', 'pests', 'disease', 'other'] as const satisfies readonly PointType[]

export const POINT_TYPE_LABELS: Record<PointType, string> = {
  'soil-sample': 'Проба ґрунту',
  pests: 'Шкідники',
  disease: 'Хвороби рослин',
  other: 'Інше',
}

export const POINT_TYPE_COLORS: Record<PointType, string> = {
  'soil-sample': '#92400e',
  pests: '#b91c1c',
  disease: '#7c3aed',
  other: '#475569',
}

export function isPointType(value: string): value is PointType {
  return (POINT_TYPES as readonly string[]).includes(value)
}
