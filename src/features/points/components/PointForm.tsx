import { useState, type FormEvent } from 'react'
import { Button } from '../../../shared/ui'
import { isPointType, POINT_TYPES, POINT_TYPE_LABELS } from '../lib/pointTypes'
import type { PointType } from '../types'

interface PointFormValues {
  type: PointType
  description?: string
}

interface PointFormProps {
  onSubmit: (values: PointFormValues) => void
  onCancel: () => void
}

export function PointForm({ onSubmit, onCancel }: PointFormProps) {
  const [type, setType] = useState<PointType>(POINT_TYPES[0])
  const [description, setDescription] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({ type, description: description.trim() || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-56 flex-col gap-2 text-sm">
      <label className="flex flex-col gap-1">
        Тип точки
        <select
          value={type}
          onChange={(event) => {
            const { value } = event.target
            if (isPointType(value)) setType(value)
          }}
          className="rounded border border-slate-300 px-2 py-1"
        >
          {POINT_TYPES.map((pointType) => (
            <option key={pointType} value={pointType}>
              {POINT_TYPE_LABELS[pointType]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        Опис (опціонально)
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          className="rounded border border-slate-300 px-2 py-1"
        />
      </label>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="submit">Додати</Button>
      </div>
    </form>
  )
}
