# Code review: оцінка і дорожня карта покращень

Документ складається з двох частин:
1. **Оцінка** поточного стану коду.
2. **Дорожня карта**: лише ті зміни, які реально піднімають рівень проєкту. Кожен пункт описано так, щоб його можна було взяти й реалізувати окремо: проблема → де → рішення (з ескізом коду) → тест → критерій готовності → commit message.

Стан на момент ревʼю: `pnpm typecheck` ✅, `pnpm lint` ✅, `pnpm test` ✅ (3 файли, 11 тестів), git чистий.

---

## 1. Оцінка

| Категорія | Бал | Обґрунтування |
|---|---|---|
| Архітектура і межі модулів | **9/10** | Доменна структура, `index.ts` як публічний API, односторонні залежності `shared ← fields, points ← map ← app`, `fields` і `points` не знають одне про одного. Мінус: правила тримаються на дисципліні, лінтер їх не перевіряє. |
| TypeScript | **9/10** | `strict` + `noUncheckedIndexedAccess`, жодного `any`, type guards замість `as`, `Record<PointType, …>` для exhaustiveness, `as const satisfies`. Мінус: дані з `localStorage` не перевіряються під час виконання. |
| Стан і React-патерни | **8/10** | Активне поле тільки в URL, Zustand без похідних селекторів, `useMemo`/`memo` там, де потрібно. Мінус: `usePointDisplay` називається хуком, хоча не використовує жодного хука; Leaflet-іконки створюються заново на кожен рендер. |
| Коректність | **7/10** | Основні сценарії працюють. Є реальний баг: чернетка точки переживає зміну поля (§3, 1.1). Ще два недоліки: карта не переміщується до вибраного поля, а збережені дані не мають версії. |
| Тести | **5/10** | Добре покрита чиста логіка (geo, filter/sort), еталон MGRS взято з незалежної бібліотеки. Але поведінку (стор, форма, фільтри, порожні стани, флоу додавання точки) не перевіряє жоден тест. |
| Доступність | **5/10** | Фільтри без `label`, банер-попередження не оголошується скрінрідером, маркери без доступної назви. |
| UX карти | **7/10** | Попап на місці кліку, попередження при кліку поза полем, два різні порожні стани. Мінус: немає центрування на полі, немає підказки, як додати першу точку, `h-screen` на мобільних. |
| Документація | **7/10** | Сильний README з обґрунтуванням рішень. Мінус: цей файл описував уже виправлені проблеми, а README (рядок 51) посилається на логіку, яка переїхала в `useAddPointFlow`. |

### Загальна оцінка: ≈ 7.5 / 10

Сильний middle-рівень: архітектура і типізація вже на рівні, який не соромно показати на ревʼю. До «senior»-рівня бракує трьох речей:
- **автоматичного захисту** архітектурних правил (зараз вони лише в документації);
- **тестів поведінки**, а не тільки чистих функцій;
- **виправлення кількох edge-case'ів**, які легко знайти, просто клікаючи по застосунку.

Після виконання етапів 1–3 нижче очікувана оцінка — **≈ 9 / 10**.

---

## 2. Уже виправлено (з попереднього ревʼю)

Попередня версія цього файлу містила знахідки, які вже закриті:

| Знахідка | Рішення | Коміт |
|---|---|---|
| SRP: `AddPointHandler` одночасно тримав стан, таймер, валідацію і рендер | логіка винесена в хук `useAddPointFlow` | `a12892e` |
| DIP: `FieldPolygon` сам викликав `useNavigate` | приймає callback `onSelect`, навігацію робить `map` | `8a90088` |
| DRY: однаковий блок деталей у `PointListItem` і `PointMarker`; `toMgrs` на кожен рендер | спільне форматування + `React.memo` на обох компонентах | `a3b4cc4` |
| Прихований `any` через `as PointType` / `as SortOrder` | type guards `isPointType`, `isSortOrder` | `d2c6676` |
| Дубль `toFixed(1) га` | `formatFieldArea` | `59e64c7` |

Позитивні висновки попереднього ревʼю лишаються в силі:
- **OCP:** новий тип точки додається правками у 2 файлах, а компілятор сам підкаже, де бракує ключа.
- **TypeScript:** немає ні `any`, ні `let`, ні зайвих анотацій.
- **Мемоізація:** `useMemo` стоїть лише там, де він обґрунтований.

---

## 3. Дорожня карта

Порядок виконання: **Етап 1 → 2.1 → 2.2 → 2.3 → 2.4 → Етап 3**. Alias (2.1) іде перед лінт-правилами (2.2), бо з `@/…` шляхами правила стають простими й надійними.

Після кожного пункту запускати:

```bash
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

### Етап 1 — коректність (обов'язково)

#### 1.1. Чернетка точки переживає зміну активного поля 🔴

**Проблема.** `src/features/map/hooks/useAddPointFlow.ts:15` зберігає `pending: LatLng | null` незалежно від поля. Сценарій:
1. клікнути всередині поля 1 — відкриється форма;
2. у списку зліва вибрати поле 2 — `AddPointHandler` не перемонтовується, а Popup має `autoClose={false}`, тож форма лишається відкритою;
3. натиснути «Додати» — `handleSubmit` (`AddPointHandler.tsx:15-24`) бере **нове** `activeField`.

Результат: точка зберігається з `fieldId`/`fieldName` поля 2, хоча її координати лежать у полі 1.

**Рішення: вивести стан, а не синхронізувати його** (підхід React docs: «You Might Not Need an Effect»). Чернетка запам'ятовує, до якого поля вона належить, а `pending` рахується на льоту:

```ts
// src/features/map/lib/pointDraft.ts
import type { LatLng } from '@/shared/geo'

export interface PointDraft {
  fieldId: string
  point: LatLng
}

export function draftForField(draft: PointDraft | null, fieldId: string | undefined): LatLng | null {
  return draft !== null && draft.fieldId === fieldId ? draft.point : null
}
```

```ts
// useAddPointFlow.ts — ключові зміни
const [draft, setDraft] = useState<PointDraft | null>(null)
const pending = draftForField(draft, activeField?.properties.id)

// у click():
if (isPointInField(point, activeField)) {
  setShowOutsideWarning(false)
  setDraft({ fieldId: activeField.properties.id, point })
} else {
  setDraft(null)
  setShowOutsideWarning(true)
}

return { pending, showOutsideWarning, cancel: () => setDraft(null) }
```

Коли поле змінюється, `pending` стає `null` → Popup розмонтовується → форма закривається. Жодного `useEffect` і жодного `key`-хака.

**Тест:** `src/features/map/lib/pointDraft.test.ts` — те саме поле повертає точку; інше поле → `null`; `null`-чернетка → `null`; `fieldId === undefined` → `null`.

**Готово, коли:** у `pnpm dev` сценарій вище закриває форму на кроці 2.

**Коміт:** `fix(map): drop pending point when active field changes`

---

#### 1.2. Карта не переміщується до активного поля 🟠

**Проблема.** `src/features/map/components/MapView.tsx:11,19` — `center` у `MapContainer` застосовується лише при монтуванні. Вибір поля в списку чи відкриття посилання `/fields/field-4` не зсуває карту. Зараз цього не видно лише тому, що всі 4 поля вміщаються на екрані при zoom 13.

**Рішення.** Новий компонент усередині `MapContainer`. Він перевикористовує `geoJsonPolygonToLatLngs` із `src/shared/geo/polygon.ts` і рухає карту **лише коли поле не видно повністю**. Так ми не втрачаємо з поля зору сусідні поля, по яких теж можна клікати.

```tsx
// src/features/map/components/FitActiveField.tsx
import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import type { Field } from '@/features/fields'
import { geoJsonPolygonToLatLngs } from '@/shared/geo'

export function FitActiveField({ field }: { field: Field | undefined }) {
  const map = useMap()

  useEffect(() => {
    if (!field) return
    const [outerRing] = geoJsonPolygonToLatLngs(field)
    if (!outerRing) return
    const bounds = L.latLngBounds(outerRing)
    if (!map.getBounds().contains(bounds)) {
      map.flyToBounds(bounds, { padding: [32, 32], maxZoom: 15 })
    }
  }, [map, field])

  return null
}
```

У `MapView` додати `<FitActiveField field={activeField} />`. Об'єкт `field` приходить зі статичного масиву, тому його референс стабільний, і залежність `[map, field]` коректна.

**Готово, коли:** відкриття `/fields/field-4` при зменшеному вікні показує поле 4; перемикання між видимими полями не смикає карту.

**Коміт:** `feat(map): bring active field into view`

---

#### 1.3. Persist: версія, лише потрібні дані, валідація 🟠

**Проблема.** `src/features/points/store/pointsStore.ts:43`:
- немає `version`: будь-яка зміна формату `MonitoringPoint` мовчки зламає вже збережені дані;
- дані з `localStorage` не валідуються: запис з невідомим `type` дасть `undefined` у лейблі й кольорі маркера;
- зберігаються й `filters`: пошуковий рядок переживає перезавантаження, і користувач бачить «Нічого не знайдено», не розуміючи чому.

**Рішення.**

```ts
// src/features/points/lib/points.ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isMonitoringPoint(value: unknown): value is MonitoringPoint {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.fieldId === 'string' &&
    typeof value.fieldName === 'string' &&
    typeof value.lat === 'number' &&
    typeof value.lng === 'number' &&
    typeof value.type === 'string' &&
    isPointType(value.type) &&
    (value.description === undefined || typeof value.description === 'string') &&
    typeof value.createdAt === 'string'
  )
}

export function restorePoints(persisted: unknown): MonitoringPoint[] {
  if (!isRecord(persisted) || !Array.isArray(persisted.points)) return []
  return persisted.points.filter(isMonitoringPoint)
}
```

```ts
// pointsStore.ts — опції persist
{
  name: 'agricultural-fields.points',
  version: 1,
  migrate: (persisted) => persisted,
  partialize: (state) => ({ points: state.points }),
  merge: (persisted, current) => ({ ...current, points: restorePoints(persisted) }),
}
```

⚠️ **`migrate` обов'язковий.** Наявні дані збережені з версією `0`. Якщо змінити версію без `migrate`, Zustand виведе помилку й **відкине збережений стан** (`zustand/middleware`, гілка «couldn't be migrated since no migrate function was provided»), тобто користувачі втратять усі точки. Формат між v0 і v1 не змінився, тому `migrate` — тотожна функція, а валідацію робить `merge`.

**Тест:** `points.test.ts` — `isMonitoringPoint` (валідна точка; невідомий `type`; відсутнє поле; `null`), `restorePoints` (відфільтровує сміття, `undefined` → `[]`).

**Готово, коли:** після ручного запису сміття в `localStorage` застосунок відкривається без помилок і показує лише валідні точки; старі точки (v0) не зникають.

**Коміт:** `fix(points): version, partialize and validate persisted points`

---

### Етап 2 — інженерна якість

#### 2.1. Path alias `@/`

**Проблема.** Імпорти на кшталт `'../../../shared/geo'` крихкі: перенесеш файл — зламаються. Крім того, лінт-правила для таких шляхів (2.2) дуже незручно писати.

**Рішення.**

```jsonc
// tsconfig.app.json → compilerOptions
"paths": { "@/*": ["./src/*"] }
```

```ts
// vite.config.ts
import { fileURLToPath } from 'node:url'
// ...
resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
```

Замінити **всі імпорти між модулями** (`app` → `features`, `features` → `features`, `features` → `shared`) на `@/…`. Імпорти всередині однієї фічі (`'../lib/points'`, `'./PointListItem'`) лишаються відносними.

**Готово, коли:** `grep -rn "'\.\./\.\./" src` порожній; збірка і тести зелені (Vitest бере alias з того самого `vite.config.ts`).

**Коміт:** `refactor: add @ path alias for cross-module imports`

---

#### 2.2. Лінт-захист архітектурних правил

**Проблема.** Правила з `AGENTS.md` («`fields` ↛ `points`», «лише через `index.ts`», «гео-бібліотеки лише в `shared/geo`») зараз ніщо не перевіряє. Новий розробник порушить їх непомітно.

**Рішення:** вбудоване правило `no-restricted-imports`, без нових залежностей. У flat config правило з пізнішого блоку **заміщує** попереднє для тих самих файлів, тому кожен блок містить повний набір заборон для своєї папки.

```js
// eslint.config.js — додаткові блоки після основного
const common = [
  { group: ['../../*', '../../**'], message: 'Між модулями імпортуйте через @/…' },
  { group: ['@/features/*/*'], message: 'Імпортуйте фічу лише через її index.ts' },
  { group: ['mgrs', '@turf/*'], message: 'Гео-бібліотеки — лише в shared/geo' },
]
const restrict = (...extra) => ({
  'no-restricted-imports': ['error', { patterns: [...common, ...extra] }],
})

export default tseslint.config(
  // ...існуючі блоки
  { files: ['src/**/*.{ts,tsx}'], rules: restrict() },
  {
    files: ['src/features/fields/**'],
    rules: restrict({ group: ['@/features/points', '@/features/map'], message: 'fields не залежить від points/map' }),
  },
  {
    files: ['src/features/points/**'],
    rules: restrict({ group: ['@/features/fields', '@/features/map'], message: 'points не залежить від fields/map' }),
  },
  {
    files: ['src/shared/**'],
    rules: restrict({ group: ['@/features/*', '@/app/*', 'leaflet', 'react-leaflet'], message: 'shared не залежить від фіч і карти' }),
  },
  {
    files: ['src/shared/geo/**'],
    rules: { 'no-restricted-imports': 'off' },
  },
)
```

Останній блок вимикає правило для `shared/geo`, бо саме там живуть `mgrs`/`@turf`. Leaflet свідомо **не** забороняємо в `fields`/`points` — див. §4.

**Перевірка правил:** тимчасово додати в `FieldCard.tsx` рядок `import { POINT_TYPES } from '@/features/points'` → `pnpm lint` має впасти з повідомленням; потім прибрати.

**Коміт:** `chore(lint): enforce feature boundaries with no-restricted-imports`

---

#### 2.3. Тести поведінки

Testing Library і `jest-dom` уже встановлені, `setup.ts` підключений. Що додати:

| Файл тесту | Що перевіряє |
|---|---|
| `features/points/store/pointsStore.test.ts` | `addPoint` додає точку з `id`/`createdAt` (`vi.setSystemTime`); `removePoint`; сетери фільтрів не зачіпають `points` |
| `features/points/components/PointForm.test.tsx` | сабміт з типом за замовчуванням; опис `'  жук  '` → `'жук'`; порожній опис → `undefined`; «Скасувати» викликає `onCancel` |
| `features/points/components/PointFilters.test.tsx` | зміна типу/пошуку/сортування пише в стор; «Скинути» повертає `{ type: 'all', search: '', sortOrder: 'newest' }` |
| `features/points/components/PointList.test.tsx` | «Точок ще немає» vs «Нічого не знайдено» vs список |
| `shared/geo/area.test.ts` | поле 1 ≈ 78.72 га (`toBeCloseTo(78.72, 1)`); `formatFieldArea` → `'78.7 га'` |
| `shared/geo/polygon.test.ts` | порядок `[lng, lat]` → `{ lat, lng }`; throw на позицію з одним числом |
| `features/points/lib/pointTypes.test.ts` | `isPointType`, `isSortOrder` |
| `features/map/lib/pointDraft.test.ts` | з пункту 1.1 |

Для тестів стору й компонентів, що його читають, скидати стан у `beforeEach`:

```ts
beforeEach(() => {
  localStorage.clear()
  usePointsStore.setState({ points: [], filters: { type: 'all', search: '', sortOrder: 'newest' } })
})
```

`FieldPolygon`, `PointMarker` і `MapView` у jsdom свідомо не тестуємо: Leaflet потребує реальних розмірів DOM. Цей шар — кандидат на E2E (§4).

**Готово, коли:** ~35+ тестів, усі зелені; README (розділ «Тести») оновлено.

**Коміт:** `test: cover store, point components and geo helpers`

---

#### 2.4. Дрібний рефакторинг якості

1. **`usePointDisplay` → `getPointDisplay`.** `src/features/points/hooks/usePointDisplay.ts:13` не викликає хуків, а префікс `use` за правилами React означає «хук» (з обмеженнями на виклик в умовах і циклах). Перенести в `features/points/lib/pointDisplay.ts` як звичайну функцію. Обидва споживачі вже в `memo`, тож продуктивність не зміниться.

2. **Кеш іконок.** `src/features/points/lib/icons.ts:5` створює новий `L.divIcon` на кожен виклик. Коли `memo` пропускає ре-рендер, це нешкідливо, але при кожному справжньому ре-рендері маркера react-leaflet бачить новий об'єкт і викликає `setIcon`, тобто перебудовує DOM.
   ```ts
   const iconCache = new Map<PointType, L.DivIcon>()

   export function getPointIcon(type: PointType): L.DivIcon {
     const cached = iconCache.get(type)
     if (cached) return cached
     const icon = L.divIcon({ /* як зараз */ })
     iconCache.set(type, icon)
     return icon
   }
   ```

3. **Звузити публічні API** до того, що реально імпортується ззовні:
   - `features/points/index.ts`: лишити `PointFilters`, `PointList`, `PointMarker`, `PointForm`, `type PointFormValues`, `useVisiblePoints`, `usePointsStore`. Прибрати `filterPoints`, `sortPoints`, `POINT_TYPES`, `POINT_TYPE_LABELS`, `POINT_TYPE_COLORS`, `PointListItem` і типи, які ніхто не використовує.
   - `features/fields/index.ts`: прибрати `FieldCard`, `getFieldById`, `FieldProperties`.

   Менший API — менше зв'язності й менше того, що доведеться підтримувати зворотно сумісним.

**Коміт:** `refactor(points): plain display helper, icon cache, narrower public API`

---

### Етап 3 — доступність, UX і документація

#### 3.1. Доступність і дрібний UX

| Що | Де | Зміна |
|---|---|---|
| Фільтри без підписів | `PointFilters.tsx:29,41,48` | `aria-label="Тип точки"`, `"Пошук за описом"`, `"Сортування"` |
| Банер не оголошується | `AddPointHandler.tsx:29` | `role="status" aria-live="polite"` |
| Маркери без назви | `PointMarker.tsx:18`, `AddPointHandler.tsx:35` | проп `title` у `<Marker>` (Leaflet ставить його атрибутом на фокусований елемент маркера): `title={typeLabel}` і `title="Нова точка"` |
| 100vh на мобільних | `AppShell.tsx:5` | `h-screen` → `h-dvh` |
| Незрозуміло, як додати першу точку | `PointList.tsx:10` | «Точок ще немає. Клікніть усередині виділеного поля на карті, щоб додати.» |

**Готово, коли:** VoiceOver/скрінрідер називає фільтри й маркери; на iPhone Safari нижня панель не ховається під адресним рядком.

**Коміт:** `feat(a11y): labels, live region, marker titles, dvh layout`

#### 3.2. Синхронізувати документацію

- `README.md:51` — валідацію кліку тепер робить `useAddPointFlow`, а не `AddPointHandler`.
- README, розділ «Що б я додав» — прибрати виконане (тести компонентів, тест `area.ts`).
- README, розділ «Тести» — новий список тестів.
- Згадати лінт-правила з 2.2 у розділі архітектури: «правила перевіряються `pnpm lint`».

**Коміт:** `docs: sync README with implemented improvements`

---

## 4. Що свідомо НЕ робимо (і чому)

| Ідея | Чому ні |
|---|---|
| Повністю винести Leaflet з `fields`/`points` у `map` | Великий рефакторинг заради гіпотетичної заміни бібліотеки карт. Межу задокументовано, а 2.2 не дасть Leaflet потрапити в `shared`. Робити лише тоді, коли заміна карти стане реальною. |
| Рахувати `useVisiblePoints` один раз на сторінку | Два проходи O(n log n) на десятках точок — виграш невимірний, а прокидання пропсів ускладнить композицію. |
| Fallback для `crypto.randomUUID` | Працює на `localhost` і `https`, тобто в усіх реальних сценаріях. Фіксуємо як відоме обмеження: не працює при відкритті по `http://<IP>`. |
| Кластеризація маркерів, віртуалізація списку | Актуально з тисяч точок. Зараз це передчасна оптимізація; готова відповідь на питання «що буде з 10 000 точок». |
| Undo видалення, підтвердження | Приємно, але не впливає на якість коду. Опційно, якщо лишиться час. |
| E2E (Playwright) | Нова залежність і CI-інфраструктура. Найцінніший наступний крок **після** цього плану: один сценарій «клік → форма → точка в списку й на карті → перезавантаження → точка на місці». |
| `console.error` у тілі `RouteError`, OSM-субдомени `{s}` | Косметика. Можна зробити одним комітом `chore: minor cleanups`, якщо дійдуть руки. |

---

## 5. Чекліст виконання

- [x] 1.1 чернетка точки прив'язана до поля + тест — `8512c80`
- [x] 1.2 `FitActiveField` — `f116e28`
- [x] 1.3 persist `version` + `migrate` + `partialize` + `merge` з валідацією + тести — `20270ce`
- [x] 2.1 alias `@/` — `9c623a8`
- [x] 2.2 `no-restricted-imports` + ручна перевірка, що правило спрацьовує — `14d372d`
- [x] 2.3 тести поведінки — `150ea65`
- [x] 2.4 `getPointDisplay`, кеш іконок, вузькі `index.ts` — `de82524`
- [x] 3.1 a11y + `h-dvh` + підказка в порожньому стані — `490a96e`
- [x] 3.2 README — `3d83024`

Після кожного пункту: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`. Для 1.1, 1.2 і 3.1 додатково перевірено вручну в `pnpm dev`.

Усі пункти дорожньої карти (розділ 3) виконано й закомічено окремими комітами; розділ 4 («свідомо не робимо») лишається чинним — ці пункти не входили в обсяг.
