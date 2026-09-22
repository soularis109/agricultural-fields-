import { describe, expect, it } from 'vitest'
import type { MonitoringPoint } from '../types'
import { filterPoints, sortPoints } from './points'

const points: MonitoringPoint[] = [
  {
    id: '1',
    fieldId: 'field-1',
    fieldName: 'Поле №1',
    lat: 50.455,
    lng: 30.528,
    type: 'soil-sample',
    description: 'Зразок біля дороги',
    createdAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: '2',
    fieldId: 'field-1',
    fieldName: 'Поле №1',
    lat: 50.456,
    lng: 30.529,
    type: 'pests',
    description: 'Колорадський жук',
    createdAt: '2026-01-03T10:00:00.000Z',
  },
  {
    id: '3',
    fieldId: 'field-2',
    fieldName: 'Поле №2',
    lat: 50.457,
    lng: 30.556,
    type: 'disease',
    createdAt: '2026-01-02T10:00:00.000Z',
  },
]

describe('filterPoints', () => {
  it('filters by type', () => {
    expect(filterPoints(points, { type: 'pests', search: '' })).toEqual([points[1]])
  })

  it('filters by case-insensitive description search', () => {
    expect(filterPoints(points, { type: 'all', search: 'жук' })).toEqual([points[1]])
  })

  it('keeps points without a description when there is no search term', () => {
    expect(filterPoints(points, { type: 'all', search: '' })).toHaveLength(3)
  })

  it('excludes points without a description when a search term is set', () => {
    expect(filterPoints(points, { type: 'all', search: 'будь-що' })).toEqual([])
  })
})

describe('sortPoints', () => {
  it('sorts newest first', () => {
    expect(sortPoints(points, 'newest').map((p) => p.id)).toEqual(['2', '3', '1'])
  })

  it('sorts oldest first', () => {
    expect(sortPoints(points, 'oldest').map((p) => p.id)).toEqual(['1', '3', '2'])
  })

  it('does not mutate the input array', () => {
    const copy = [...points]
    sortPoints(points, 'oldest')
    expect(points).toEqual(copy)
  })
})
