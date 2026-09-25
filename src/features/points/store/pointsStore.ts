import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { restorePoints } from '../lib/points'
import type { MonitoringPoint, PointFilterState } from '../types'

interface AddPointInput {
  fieldId: string
  fieldName: string
  lat: number
  lng: number
  type: MonitoringPoint['type']
  description?: string
}

interface PointsState {
  points: MonitoringPoint[]
  filters: PointFilterState
  addPoint: (input: AddPointInput) => void
  removePoint: (id: string) => void
  setFilterType: (type: PointFilterState['type']) => void
  setSearch: (search: string) => void
  setSortOrder: (sortOrder: PointFilterState['sortOrder']) => void
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set) => ({
      points: [],
      filters: { type: 'all', search: '', sortOrder: 'newest' },
      addPoint: (input) =>
        set((state) => ({
          points: [
            ...state.points,
            { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
          ],
        })),
      removePoint: (id) =>
        set((state) => ({ points: state.points.filter((point) => point.id !== id) })),
      setFilterType: (type) => set((state) => ({ filters: { ...state.filters, type } })),
      setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
      setSortOrder: (sortOrder) =>
        set((state) => ({ filters: { ...state.filters, sortOrder } })),
    }),
    {
      name: 'agricultural-fields.points',
      version: 1,
      migrate: (persisted) => persisted,
      partialize: (state) => ({ points: state.points }),
      merge: (persisted, current) => ({ ...current, points: restorePoints(persisted) }),
    },
  ),
)
