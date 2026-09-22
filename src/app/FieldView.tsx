import { FieldInfoPanel, FieldList, FieldNotFound, useActiveField } from '../features/fields'
import { MapView } from '../features/map'
import { PointFilters, PointList } from '../features/points'

export function FieldView() {
  const activeField = useActiveField()

  if (!activeField) {
    return (
      <div className="p-4">
        <FieldNotFound />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <aside className="flex flex-col gap-4 overflow-y-auto border-b border-slate-200 p-4 lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-b-0">
        <FieldInfoPanel field={activeField} />
        <FieldList activeField={activeField} />
      </aside>

      <div className="h-72 flex-shrink-0 lg:h-auto lg:flex-1">
        <MapView activeField={activeField} />
      </div>

      <aside className="flex flex-col gap-3 overflow-y-auto border-t border-slate-200 p-4 lg:w-96 lg:flex-shrink-0 lg:border-t-0 lg:border-l">
        <PointFilters />
        <PointList />
      </aside>
    </div>
  )
}
