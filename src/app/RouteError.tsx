import { Link, useRouteError } from 'react-router-dom'

/** Fallback for unexpected render-time errors — distinct from the "field not
 *  found" domain state, which is a valid outcome, not an error. */
export function RouteError() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold text-slate-900">Щось пішло не так</h1>
      <p className="text-sm text-slate-600">
        Сталася неочікувана помилка під час рендеру сторінки.
      </p>
      <Link to="/" className="text-sm text-emerald-700 underline">
        На головну
      </Link>
    </div>
  )
}
