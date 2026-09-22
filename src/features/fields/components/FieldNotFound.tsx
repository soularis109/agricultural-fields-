import { Link } from 'react-router-dom'
import { getFirstField } from '../data/fields'

export function FieldNotFound() {
  const firstField = getFirstField()

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-medium">Поле не знайдено.</p>
      <Link
        to={`/fields/${firstField.properties.id}`}
        className="mt-2 inline-block underline"
      >
        Перейти до першого поля
      </Link>
    </div>
  )
}
