import { formatFieldArea } from '../../../shared/geo'
import type { Field } from '../types'

interface FieldInfoPanelProps {
  field: Field
}

export function FieldInfoPanel({ field }: FieldInfoPanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-900">{field.properties.name}</h2>
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
        <dt>Культура</dt>
        <dd>{field.properties.crop}</dd>
        <dt>Площа (за геометрією)</dt>
        <dd>{formatFieldArea(field)}</dd>
      </dl>
    </div>
  )
}
