import { fields } from '../data/fields'
import type { Field } from '../types'
import { FieldCard } from './FieldCard'

interface FieldListProps {
  activeField: Field | undefined
}

export function FieldList({ activeField }: FieldListProps) {
  return (
    <ul className="flex flex-col gap-1">
      {fields.features.map((field) => (
        <li key={field.properties.id}>
          <FieldCard
            field={field}
            isActive={activeField?.properties.id === field.properties.id}
          />
        </li>
      ))}
    </ul>
  )
}
