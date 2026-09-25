import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { PointList } from './PointList'
import { usePointsStore } from '../store/pointsStore'
import type { MonitoringPoint } from '../types'

const point: MonitoringPoint = {
  id: '1',
  fieldId: 'field-1',
  fieldName: 'Поле №1',
  lat: 50.455,
  lng: 30.528,
  type: 'pests',
  description: 'Колорадський жук',
  createdAt: '2026-01-01T10:00:00.000Z',
}

beforeEach(() => {
  localStorage.clear()
  usePointsStore.setState({ points: [], filters: { type: 'all', search: '', sortOrder: 'newest' } })
})

describe('PointList', () => {
  it('shows an empty state when there are no points at all', () => {
    render(<PointList />)

    expect(
      screen.getByText('Точок ще немає. Клікніть усередині виділеного поля на карті, щоб додати.'),
    ).toBeInTheDocument()
  })

  it('shows a "nothing found" state when filters exclude every point', () => {
    usePointsStore.setState({
      points: [point],
      filters: { type: 'disease', search: '', sortOrder: 'newest' },
    })

    render(<PointList />)

    expect(screen.getByText('Нічого не знайдено.')).toBeInTheDocument()
  })

  it('renders the visible points', () => {
    usePointsStore.setState({ points: [point] })

    render(<PointList />)

    expect(screen.getByText(point.description!)).toBeInTheDocument()
  })
})