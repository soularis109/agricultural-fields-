import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { PointFilters } from './PointFilters'
import { usePointsStore } from '../store/pointsStore'

const initialFilters = { type: 'all' as const, search: '', sortOrder: 'newest' as const }

beforeEach(() => {
  localStorage.clear()
  usePointsStore.setState({ points: [], filters: { ...initialFilters } })
})

describe('PointFilters', () => {
  it('updates the type filter in the store', async () => {
    render(<PointFilters />)
    const [typeSelect] = screen.getAllByRole('combobox')

    await userEvent.selectOptions(typeSelect!, 'pests')

    expect(usePointsStore.getState().filters.type).toBe('pests')
  })

  it('updates the search filter in the store', async () => {
    render(<PointFilters />)

    await userEvent.type(screen.getByPlaceholderText('Пошук за описом...'), 'жук')

    expect(usePointsStore.getState().filters.search).toBe('жук')
  })

  it('updates the sort order in the store', async () => {
    render(<PointFilters />)
    const [, sortSelect] = screen.getAllByRole('combobox')

    await userEvent.selectOptions(sortSelect!, 'oldest')

    expect(usePointsStore.getState().filters.sortOrder).toBe('oldest')
  })

  it('resets all filters to their defaults', async () => {
    usePointsStore.setState({ filters: { type: 'pests', search: 'жук', sortOrder: 'oldest' } })
    render(<PointFilters />)

    await userEvent.click(screen.getByRole('button', { name: 'Скинути' }))

    expect(usePointsStore.getState().filters).toEqual(initialFilters)
  })
})