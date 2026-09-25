import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePointsStore } from './pointsStore'
import type { MonitoringPoint } from '../types'

const initialFilters = { type: 'all' as const, search: '', sortOrder: 'newest' as const }

beforeEach(() => {
  localStorage.clear()
  usePointsStore.setState({ points: [], filters: { ...initialFilters } })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('addPoint', () => {
  it('adds a point with a generated id and the current timestamp', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    usePointsStore.getState().addPoint({
      fieldId: 'field-1',
      fieldName: 'Поле №1',
      lat: 50.455,
      lng: 30.528,
      type: 'pests',
      description: 'Колорадський жук',
    })

    const [point] = usePointsStore.getState().points
    expect(point).toMatchObject({
      fieldId: 'field-1',
      fieldName: 'Поле №1',
      lat: 50.455,
      lng: 30.528,
      type: 'pests',
      description: 'Колорадський жук',
      createdAt: '2026-01-01T10:00:00.000Z',
    })
    expect(point?.id).toEqual(expect.any(String))
  })
})

describe('removePoint', () => {
  it('removes only the point with the matching id', () => {
    const points: MonitoringPoint[] = [
      {
        id: '1',
        fieldId: 'field-1',
        fieldName: 'Поле №1',
        lat: 50.455,
        lng: 30.528,
        type: 'pests',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
      {
        id: '2',
        fieldId: 'field-1',
        fieldName: 'Поле №1',
        lat: 50.456,
        lng: 30.529,
        type: 'disease',
        createdAt: '2026-01-02T10:00:00.000Z',
      },
    ]
    usePointsStore.setState({ points })

    usePointsStore.getState().removePoint('1')

    expect(usePointsStore.getState().points.map((point) => point.id)).toEqual(['2'])
  })
})

describe('filter setters', () => {
  it('update filters without touching points', () => {
    const points: MonitoringPoint[] = [
      {
        id: '1',
        fieldId: 'field-1',
        fieldName: 'Поле №1',
        lat: 50.455,
        lng: 30.528,
        type: 'pests',
        createdAt: '2026-01-01T10:00:00.000Z',
      },
    ]
    usePointsStore.setState({ points })

    usePointsStore.getState().setFilterType('pests')
    usePointsStore.getState().setSearch('жук')
    usePointsStore.getState().setSortOrder('oldest')

    expect(usePointsStore.getState().points).toEqual(points)
    expect(usePointsStore.getState().filters).toEqual({
      type: 'pests',
      search: 'жук',
      sortOrder: 'oldest',
    })
  })
})