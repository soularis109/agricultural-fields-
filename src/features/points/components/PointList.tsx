import { useVisiblePoints } from '../hooks/useVisiblePoints'
import { usePointsStore } from '../store/pointsStore'
import { PointListItem } from './PointListItem'

/** Shows points from all fields — each row carries its own field's name. */
export function PointList() {
  const visiblePoints = useVisiblePoints()
  const totalPoints = usePointsStore((state) => state.points.length)

  if (totalPoints === 0) {
    return <p className="text-sm text-slate-500">Точок ще немає.</p>
  }

  if (visiblePoints.length === 0) {
    return <p className="text-sm text-slate-500">Нічого не знайдено.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {visiblePoints.map((point) => (
        <PointListItem key={point.id} point={point} />
      ))}
    </ul>
  )
}
