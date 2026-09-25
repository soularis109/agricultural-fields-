import { Link } from 'react-router-dom'
import { formatFieldArea } from '@/shared/geo'
import type { Field } from '../types'

interface FieldCardProps {
  field: Field
  isActive: boolean
}

export function FieldCard({ field, isActive }: FieldCardProps) {
  return (
    <Link
      to={`/fields/${field.properties.id}`}
      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'bg-emerald-100 font-medium text-emerald-900'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="block">{field.properties.name}</span>
      <span className="block text-xs text-slate-500">
        {formatFieldArea(field)} · {field.properties.crop}
      </span>
    </Link>
  )
}
