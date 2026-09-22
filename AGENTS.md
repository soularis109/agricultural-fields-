# AGENTS.md

## Команди перевірки (запускати перед тим, як вважати зміну готовою)

```bash
pnpm typecheck  # tsc -b --noEmit
pnpm lint       # eslint .
pnpm test       # vitest run
pnpm build      # tsc -b && vite build
```

## Коміти

- Conventional commits, логічними групами (наприклад: `chore: vite scaffold`, `feat(fields): map + polygons`, `feat(points): store + form + list`, `test: geo adapters`).
- **Жодних комітів без прямої команди користувача в сесії.**

## Архітектурні правила (див. README.md для деталей і обґрунтування)

- Структура доменна: `app/`, `features/{fields,points,map}`, `shared/{geo,ui,lib}`. Кожна фіча має `index.ts` як публічний API.
- `features/fields` і `features/points` ніколи не імпортують одне одного напряму.
- Усі конвертації координат — лише в `shared/geo`.
- Активне поле береться тільки з URL (`useParams`), окремого стору для нього немає.
- Жоден Zustand-селектор не повертає `.filter()`/`.sort()` — похідні списки рахуються через `useMemo` в хуках.
- `@typescript-eslint/no-explicit-any` не вимикається точково.
