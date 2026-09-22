# Code review: SOLID / TypeScript / структура і продуктивність

Ревʼю без правок коду — лише знахідки з обґрунтуванням і джерелами
(React docs, TypeScript Handbook, класичні формулювання SOLID).
Ніяких критичних знахідок не виявлено — увесь список нижче рівня "критично".

## 1. SOLID

### SRP

**`src/features/map/components/AddPointHandler.tsx:19-82`** — один компонент
веде клік-стейт-машину (pending-точка + banner-попередження + `setTimeout`
на 3с), валідує клік через `isPointInField`, і рендерить Marker/Popup/форму.

- **Чому проблема**: нерендер-логіка (стан "чи точка pending", таймер
  автозникнення попередження) не відокремлена від JSX, хоча в проєкті вже є
  усталений патерн для цього (`useActiveField`, `useVisiblePoints`).
- **Як виправити**: винести в `useAddPointFlow(activeField)` →
  `{ pending, showOutsideWarning, onMapClick, confirm, cancel }`.
- **Джерело**: React docs, "Reusing Logic with Custom Hooks" —
  https://react.dev/learn/reusing-logic-with-custom-hooks
- **Пріоритет**: бажано.

### OCP — конкретна відповідь на "5-й тип точки"

Підтверджено грепом: додавання 5-го `PointType` вимагає правок лише у
**2 файлах** — `src/features/points/types.ts` (розширити union) і
`src/features/points/lib/pointTypes.ts` (додати запис у `POINT_TYPES`,
`POINT_TYPE_LABELS`, `POINT_TYPE_COLORS`). Усі 4 компоненти-консюмери
(`PointFilters`, `PointForm`, `PointListItem`, `PointMarker`) та
`lib/points.ts` вже генеричні по `PointType` — жодних змін не потребують.
`Record<PointType, string>` до того ж змусить компілятор впасти, якщо
забудете додати лейбл/колір новому типу — це "closed for modification,
open for extension" майже підручниково.

- **Джерело**: Bertrand Meyer, Open/Closed Principle (формалізація в SOLID,
  Robert C. Martin).
- Це не дефект — фіксую як позитивну оцінку, бо запитано саме конкретну
  відповідь "скільки файлів".

### DIP

**`src/features/fields/components/FieldPolygon.tsx:1-2,35-38`** — компонент
фічі `fields` імпортує `leaflet` напряму і викликає
`L.DomEvent.stopPropagation(event)`.

- **Чому проблема**: `fields` (high-level, доменна фіча) залежить від
  конкретної реалізації мапи (Leaflet), а не від абстракції, яку могла б
  власником тримати `features/map`. Заміна мап-бібліотеки зачепить `fields`,
  а не лише `map`.
- **Як виправити**: підняти обробку "клік по неактивному полігону →
  навігація" у `features/map` (передавати `onSelect` callback у
  `FieldPolygon` пропсом замість власного `useNavigate`+`L.DomEvent`
  всередині фічі `fields`).
- **Джерело**: Robert C. Martin, Dependency Inversion Principle
  ("high-level modules should not depend on low-level modules; both should
  depend on abstractions" — SOLID).
- **Пріоритет**: бажано.

**`src/features/points/components/PointMarker.tsx:1,10-17`** та
**`src/features/map/components/AddPointHandler.tsx:1,8-13`** — обидва
будують `L.divIcon()` (сирий HTML-рядок) прямо в тілі компонента домену
`points`/`map`.

- **Як виправити**: винести фабрику іконок у `features/map` (наприклад
  `createPointIcon(type)`), щоб Leaflet-специфічна деталь не жила поруч із
  доменною логікою видалення точки.
- **Джерело**: те саме формулювання DIP, що й вище.
- **Пріоритет**: коментар на майбутнє.

### ISP / LSP

Релевантного прикладу в коді немає: немає інтерфейсів, що змушують клієнта
реалізовувати зайві члени (ISP), і немає жодної спадкоємної/підтипової
ієрархії (LSP) — весь код функціональний, на хуках. Свідомо не притягую
штучний приклад.

## 2. Якість TypeScript

### `any` (явний чи прихований)

Не знайдено жодного разу (`grep -rn "\bany\b" src` — порожньо), і
`@typescript-eslint/no-explicit-any: 'error'` в `eslint.config.js:26` це
забезпечує на рівні лінту. Позитивна оцінка, знахідок немає.

### Приховане `any` через `as` (3 місця)

- `src/features/points/components/PointFilters.tsx:14` —
  `setFilterType(event.target.value as PointFilterState['type'])`
- `src/features/points/components/PointFilters.tsx:18` —
  `setSortOrder(event.target.value as PointFilterState['sortOrder'])`
- `src/features/points/components/PointForm.tsx:35` —
  `setType(event.target.value as PointType)`

- **Чому проблема**: `event.target.value` у `<select>` завжди типу
  `string`; `as` примусово звужує тип без жодної рантайм-перевірки.
  TypeScript Handbook прямо попереджає: type assertions — це "trust me,
  I know what I'm doing", компілятор тут нічого не перевіряє. Якщо колись
  список `<option>` розійдеться зі значеннями `POINT_TYPES` (тайпо,
  забутий рядок при рефакторингу), приведення мовчки пропустить невалідне
  значення аж до `POINT_TYPE_LABELS[badValue]`, де воно віддасть
  `undefined` у рендер без помилки компіляції чи рантайму.
- **Як виправити**: type guard замість `as`, наприклад

  ```ts
  function isPointType(value: string): value is PointType {
    return (POINT_TYPES as readonly string[]).includes(value)
  }
  ```

  і перевіряти перед записом у стан, або будувати опції зі спільного
  масиву `{ value, label }[]`, з якого й читати назад.
- **Джерело**: TypeScript Handbook, "Type Assertions" —
  https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions
- **Пріоритет**: бажано (реальний ризик сьогодні низький — опції
  генеруються з того самого `POINT_TYPES`, — але це буквально патерн
  "прихований any", про який запитано).

### Надлишкове ручне типування там, де TS міг би вивести сам

Не знайдено. Усі явні анотації в коді функціонально необхідні:
`useState<LatLng | null>(null)` і `useState<PointType>(POINT_TYPES[0])`
(без них тип був би вужчим за той, що присвоюється пізніше через `as`/
setter), `Record<PointType, string>` (без нього TS не змусить перелічити
всі варіанти — no exhaustiveness), `MAP_CENTER: [number, number]` (без
анотації TS вивів би `number[]`, що не підійде під тип `LatLngExpression`).
Це відповідає рекомендації TypeScript Handbook додавати анотацію там, де
вивід був би замінитим/слабшим за потрібний —
https://www.typescriptlang.org/docs/handbook/type-inference.html
Знахідок немає.

### Type widening

Не знайдено. `MAP_CENTER: [number, number]`
(`src/features/map/components/MapView.tsx:10`) явно захищає від
розширення `[50.445, 30.535]` до `number[]`. Літерали GeoJSON у
`src/features/fields/data/fields.ts` контекстно типізуються об'явленою
анотацією `FeatureCollection<Polygon, FieldProperties>`, тому рядкові
літерали (`type: 'Polygon'`) не розширюються до `string`. `let` у `src`
відсутній повністю (лише `const`) — це прибирає найпоширеніше джерело
widening-помилок. Знахідок немає.

## 3. Структура, декомпозиція, продуктивність

### Логіка, що "застрягла" в компоненті

Див. SRP-знахідку вище (`AddPointHandler.tsx`) — той самий приклад,
актуальний і тут: стейт-машина pending/warning/timer варто винести в хук.

### Дублювання логіки між features

Чесна відповідь: **між** `fields`/`points`/`map` дублювання практично
немає — залежності йдуть у напрямку, задекларованому в README (`shared` ←
`fields`, `points` ← `map` ← `app`), координатні конвертації й
форматування дат централізовані в `shared/geo`/`shared/lib`.

Найближчий реальний приклад дублювання — **в межах однієї фічі** `points`:
`src/features/points/components/PointListItem.tsx:12-34` і
`src/features/points/components/PointMarker.tsx:23-46` незалежно рендерять
практично ідентичний блок деталей точки (лейбл типу, назва поля, опис,
координати, MGRS, дата, кнопка видалення).

- **Як виправити**: винести спільний presentational-блок (`PointDetails`)
  або хук форматування (`usePointDisplay(point)`), який використовують
  обидва компоненти.
- **Пріоритет**: бажано.

Менший приклад: `src/features/fields/components/FieldCard.tsx:22` і
`src/features/fields/components/FieldInfoPanel.tsx:16` — обидва окремо
роблять `fieldAreaHectares(field).toFixed(1)} га`. Винести
`formatFieldArea(field)`. Пріоритет: коментар на майбутнє (1 рядок
дублювання).

### useMemo/useCallback — де реально потрібен, де ні

`src/features/points/hooks/useVisiblePoints.ts:16-19` — єдиний
`useMemo`/`useCallback` у всьому кодовому базі. Обґрунтовано за критерієм
React docs (кешувати обчислення, коли воно живить кілька споживачів і/або
нетривіальне): тут фільтр (`O(n)`) + сортування (`O(n log n)`) живлять
одночасно `PointList` і маркери `MapView`, і додатково зафіксовано реальну
причину (контракт стабільного snapshot `useSyncExternalStore` у Zustand
v5 — інакше нескінченний ре-рендер). Це не "про всяк випадок".

- **Джерело**: React docs, "useMemo — Memoizing expensive calculations" —
  https://react.dev/reference/react/useMemo#memoizing-expensive-calculations

Інших `useMemo`/`useCallback` в коді немає — тобто немає і жодного
випадку "додали без потреби". Знахідок про надлишкове мемо немає.

### Важкі обчислення частіше, ніж потрібно

**`src/features/points/components/PointListItem.tsx:14`** і
**`src/features/points/components/PointMarker.tsx:25`** — виклик
`toMgrs()` (WGS84 → UTM → MGRS) прямо в тілі компонента, на кожен
точковий елемент, на кожен рендер. Жоден із двох компонентів не
обгорнутий у `React.memo`.

- **Чому проблема**: оскільки `filterPoints`/`sortPoints`
  (`src/features/points/lib/points.ts`) ніколи не клонують самі об'єкти
  точок (лише масив-контейнер), референси точок лишаються стабільними між
  перефільтраціями — отже `React.memo` тут реально спрацював би: React
  пропускав би повторний рендер (а разом і повторний MGRS-розрахунок) для
  точок, не зачеплених конкретною зміною фільтра/пошуку/сортування.
  Сьогодні, з 4 мок-полями й кількома точками, вартість непомітна, але
  дублюється на кожне натискання клавіші в пошуку і лінійно зросте з
  розміром датасету.
- **Як виправити**: обгорнути `PointListItem` і `PointMarker` в
  `React.memo`.
- **Джерело**: React docs, "memo" — https://react.dev/reference/react/memo
- **Пріоритет**: бажано.

Контраст: `fieldAreaHectares()` (`@turf/area`) у `FieldCard.tsx:22` і
`FieldInfoPanel.tsx:16` рахується на кожен рендер для 4 малих статичних
полігонів — за власною рекомендацією React docs ("if the calculation is
fast, you don't need to do this at all", той самий `useMemo`-документ)
мемоізація тут була б передчасною оптимізацією. Пріоритет: коментар на
майбутнє — вартий уваги лише якщо кількість полів суттєво зросте.

`isPointInField` (`src/features/map/components/AddPointHandler.tsx:29`)
викликається лише всередині обробника кліку по мапі — раз на клік, а не в
рендері. Проблеми немає.

## Верифікація знахідок

- `grep -rn "\bany\b" src` → порожньо (підтверджує розділ "any: немає").
- `grep -rn "^\s*let " src` → порожньо (підтверджує "widening: немає").
- Відкрити файл:рядок з кожної знахідки й звірити з описом вище.
- `pnpm typecheck && pnpm lint && pnpm test` — усі знахідки нижче
  критичного рівня, тому мають проходити зелено без жодних правок.
