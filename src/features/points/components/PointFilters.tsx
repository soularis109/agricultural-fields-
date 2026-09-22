import type { ChangeEvent } from 'react'
import { Button } from '../../../shared/ui'
import { POINT_TYPES, POINT_TYPE_LABELS } from '../lib/pointTypes'
import { usePointsStore } from '../store/pointsStore'
import type { PointFilterState } from '../types'

export function PointFilters() {
  const filters = usePointsStore((state) => state.filters)
  const setFilterType = usePointsStore((state) => state.setFilterType)
  const setSearch = usePointsStore((state) => state.setSearch)
  const setSortOrder = usePointsStore((state) => state.setSortOrder)

  function handleTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setFilterType(event.target.value as PointFilterState['type'])
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    setSortOrder(event.target.value as PointFilterState['sortOrder'])
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        value={filters.type}
        onChange={handleTypeChange}
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      >
        <option value="all">Усі типи</option>
        {POINT_TYPES.map((type) => (
          <option key={type} value={type}>
            {POINT_TYPE_LABELS[type]}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={filters.search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Пошук за описом..."
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      />
      <select
        value={filters.sortOrder}
        onChange={handleSortChange}
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      >
        <option value="newest">Спочатку нові</option>
        <option value="oldest">Спочатку старі</option>
      </select>
      <Button
        variant="ghost"
        onClick={() => {
          setFilterType('all')
          setSearch('')
          setSortOrder('newest')
        }}
      >
        Скинути
      </Button>
    </div>
  )
}
