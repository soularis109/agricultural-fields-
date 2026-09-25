import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PointForm } from './PointForm'
import { POINT_TYPES } from '../lib/pointTypes'

describe('PointForm', () => {
  it('submits the default type with an empty description as undefined', async () => {
    const onSubmit = vi.fn()
    render(<PointForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.click(screen.getByRole('button', { name: 'Додати' }))

    expect(onSubmit).toHaveBeenCalledWith({ type: POINT_TYPES[0], description: undefined })
  })

  it('trims the description before submitting', async () => {
    const onSubmit = vi.fn()
    render(<PointForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await userEvent.type(screen.getByLabelText('Опис (опціонально)'), '  жук  ')
    await userEvent.click(screen.getByRole('button', { name: 'Додати' }))

    expect(onSubmit).toHaveBeenCalledWith({ type: POINT_TYPES[0], description: 'жук' })
  })

  it('calls onCancel when Скасувати is clicked', async () => {
    const onCancel = vi.fn()
    render(<PointForm onSubmit={vi.fn()} onCancel={onCancel} />)

    await userEvent.click(screen.getByRole('button', { name: 'Скасувати' }))

    expect(onCancel).toHaveBeenCalledOnce()
  })
})
