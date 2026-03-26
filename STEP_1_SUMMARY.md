# ✅ Шаг 1 — Общие типы в `shared`

## Что было сделано

### 1. Создан новый пакет `@spell/shared`
- Структура:
  ```
  packages/shared/
  ├── src/
  │   ├── dtos/
  │   │   ├── quiz.dto.ts       (5 интерфейсов)
  │   │   ├── question.dto.ts   (4 интерфейса)
  │   │   ├── attempt.dto.ts    (6 интерфейсов)
  │   │   └── upload.dto.ts     (1 интерфейс)
  │   └── index.ts              (re-exports)
  ├── dist/                      (скомпилированные файлы)
  ├── package.json
  ├── tsconfig.json
  ├── README.md
  ├── TYPES.md                   (полная документация)
  └── USAGE.md                   (инструкции)
  ```

### 2. Определены DTOs

#### Quiz (3 DTO)
- `CreateQuizDto` — для создания теста
- `UpdateQuizDto` — для редактирования
- `QuizDto` — базовые данные теста
- `QuizWithQuestionsDto` — тест со всеми вопросами

#### Question (4 DTO)
- `CreateQuestionDto` — для создания вопроса
- `UpdateQuestionDto` — для редактирования
- `QuestionDto` — полные данные (с ответом для учителя)
- `QuestionWithoutAnswerDto` — без ответа (для ученика)

#### Attempt (6 DTO)
- `CreateAttemptDto` — ответы ученика для сохранения
- `AttemptDto` — базовые данные попытки
- `AttemptWithResultsDto` — попытка с результатами
- `AnswerResultDto` — результат одного ответа
- `DiffCharDto` — посимвольное сравнение
  - Типы: `correct`, `incorrect`, `missing`, `extra`

#### Upload (1 DTO)
- `UploadResponseDto` — ответ при загрузке файла

### 3. Добавлены зависимости
- `apps/api/package.json` → `"@spell/shared": "workspace:*"`
- `apps/web/package.json` → `"@spell/shared": "workspace:*"`

### 4. Создана документация
- `README.md` — описание пакета и примеры использования
- `TYPES.md` — полная документация всех типов с примерами
- `USAGE.md` — инструкции по использованию в приложениях

## Файлы, которые были созданы

```
✅ packages/shared/package.json
✅ packages/shared/tsconfig.json
✅ packages/shared/README.md
✅ packages/shared/TYPES.md
✅ packages/shared/USAGE.md
✅ packages/shared/src/index.ts
✅ packages/shared/src/dtos/quiz.dto.ts
✅ packages/shared/src/dtos/question.dto.ts
✅ packages/shared/src/dtos/attempt.dto.ts
✅ packages/shared/src/dtos/upload.dto.ts
```

## Файлы, которые были отредактированы

```
✅ apps/api/package.json (добавлена зависимость)
✅ apps/web/package.json (добавлена зависимость)
```

## Проверка

Пакет успешно собрался:
```bash
$ cd packages/shared && npm run build
> @spell/shared@0.0.1 build
> tsc

# ✅ Без ошибок!
```

Сгенерированные файлы:
```
dist/
├── index.d.ts
├── index.js
└── dtos/
    ├── quiz.dto.d.ts
    ├── quiz.dto.js
    ├── question.dto.d.ts
    ├── question.dto.js
    ├── attempt.dto.d.ts
    ├── attempt.dto.js
    └── upload.dto.d.ts
    └── upload.dto.js
```

## Как использовать

### Backend (Nest.js)
```typescript
import { CreateQuizDto, QuizWithQuestionsDto } from '@spell/shared';

@Post()
create(@Body() dto: CreateQuizDto): Promise<QuizDto> {
  // ...
}
```

### Frontend (Next.js)
```typescript
import { QuizWithQuestionsDto, AttemptWithResultsDto } from '@spell/shared';

const quiz: QuizWithQuestionsDto = await fetchQuiz(id);
```

## Следующий шаг

**Шаг 2 — База данных и ORM**
- Поднять PostgreSQL (Docker Compose)
- Подключить TypeORM
- Создать entities:
  - `Quiz`
  - `Question`
  - `QuizAttempt`
  - `AttemptAnswer`
- Настроить миграции

## Команды

```bash
# Установить зависимости (если еще не установлены)
pnpm install

# Собрать пакет shared
pnpm build --filter @spell/shared

# Проверить типы
pnpm check-types

# Просмотр сгенерированных файлов
ls -la packages/shared/dist/
```

---

**Статус:** ✅ Завершено

**Дата:** 2024
