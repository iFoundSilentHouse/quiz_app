# ✅ Шаг 1 — Общие типы в `shared`

## Что было сделано

Создан новый независимый пакет `@spell/shared`, который стал единым источником правды для всех типов и DTO в проекте. Это позволило избежать дублирования типов между backend (Nest.js) и frontend (Next.js) и гарантировать полную типобезопасность по всему стеку.

### Определены DTO (всего 14 интерфейсов):
- **Quiz** (4 DTO):
  - `CreateQuizDto` — создание теста
  - `UpdateQuizDto` — редактирование теста
  - `QuizDto` — базовая информация
  - `QuizWithQuestionsDto` — тест со всеми вопросами
- **Question** (4 DTO):
  - `CreateQuestionDto` / `UpdateQuestionDto`
  - `QuestionDto` — полные данные (для учителя)
  - `QuestionWithoutAnswerDto` — без ответа (для ученика)
- **Attempt** (6 DTO):
  - `CreateAttemptDto`
  - `AttemptDto`, `AttemptWithResultsDto`
  - `AnswerResultDto`
  - `DiffCharDto` с типами: `correct`, `incorrect`, `missing`, `extra`
- **Upload** (1 DTO):
  - `UploadResponseDto` — ответ после загрузки изображения

### Дополнительно:
- Добавлены зависимости `workspace:*` в `apps/api` и `apps/web`.
- Создана полная документация пакета: `README.md`, `TYPES.md` (все типы с примерами), `USAGE.md` (примеры импорта).

## Файлы, которые были созданы
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
## Файлы, которые были отредактированы
✅ apps/api/package.json
✅ apps/web/package.json
## Проверка
```bash
cd packages/shared && npm run build
```
# ✅ tsc без ошибок
Пакет успешно опубликован внутри монорепозитория и готов к использованию.
Статус: ✅ Завершено
Дата: 2024
# ✅ Шаг 2 — База данных и ORM

## Что было сделано

Полностью настроена база данных PostgreSQL + TypeORM. Все сущности вынесены в пакет `@spell/shared` для переиспользования.

### Созданы 4 Entity:
- `Quiz` (OneToMany → questions, attempts)
- `Question` (ManyToOne → quiz, OneToMany → answers, индекс `quizId + order`)
- `QuizAttempt` (ManyToOne → quiz, OneToMany → answers, индекс `quizId + createdAt`)
- `AttemptAnswer` (ManyToOne → attempt + question, jsonb-поле `diff`, индекс `attemptId + questionId`)

Все связи с `ON DELETE CASCADE`.

### Реализовано:
- Конфигурация `DataSource` и `TypeOrmModule`.
- Первая миграция `InitialSchema`.
- Модульная архитектура: `SharedModule` + `QuizModule`.
- Полноценные сервисы: `QuizService`, `QuestionService`, `AttemptService`.
- Алгоритм проверки ответов (`calculateDiff`): нормализация (trim + toLowerCase), посимвольное сравнение, подсчёт score.

## Файлы, которые были созданы
✅ packages/shared/src/entities/quiz.entity.ts
✅ packages/shared/src/entities/question.entity.ts
✅ packages/shared/src/entities/quiz-attempt.entity.ts
✅ packages/shared/src/entities/attempt-answer.entity.ts
✅ packages/shared/src/entities/index.ts
✅ apps/api/src/migrations/1705315200000-InitialSchema.ts
✅ apps/api/src/modules/shared/shared.module.ts
✅ apps/api/src/modules/quiz/quiz.module.ts
✅ apps/api/src/modules/quiz/quiz.controller.ts
✅ apps/api/src/modules/quiz/quiz.service.ts
✅ apps/api/src/modules/quiz/question.service.ts
✅ apps/api/src/modules/quiz/attempt.service.ts
## Файлы, которые были отредактированы
✅ packages/shared/src/index.ts
✅ packages/shared/package.json (peerDependency typeorm)
✅ packages/shared/tsconfig.json (decorators)
✅ apps/api/typeorm.config.ts
✅ apps/api/src/app.module.ts
✅ apps/api/.env
## Проверка
- Миграции успешно применяются.
- Все CRUD-эндпоинты работают.
- Структура БД соответствует описанной выше.

**Статус:** ✅ Завершено

# ✅ Шаг 3 — Backend API (Nest.js)

## Что было сделано

Завершена полноценная REST API архитектура. Выделена чистая бизнес-логика, добавлена валидация и обработка ошибок.

### Ключевые улучшения:
- Выделен `AnswerCheckerService` — вся логика сравнения строк и генерации `diff` изолирована.
- Добавлен `ValidationPipe` + `class-validator` для всех DTO.
- Реализована полная цепочка: создание теста → добавление вопросов → сохранение попытки с автоматическим расчётом score и diff.
- Настроены глобальные CORS и глобальная обработка исключений.

### Финальные эндпоинты:
**Quizzes** — 5 методов  
**Questions** — 5 методов (включая `POST /quizzes/:id/questions`)  
**Attempts** — 3 метода (`POST /quizzes/:id/attempts`, `GET /attempts/:id`, `GET /quizzes/:id/attempts`)

(Временная Insomnia-коллекция была создана для тестирования и позже удалена при рефакторинге.)

## Файлы, которые были созданы / обновлены
- `apps/api/src/modules/quiz/quiz.controller.ts`
- `apps/api/src/modules/quiz/question.service.ts`
- `apps/api/src/modules/quiz/attempt.service.ts`
- `apps/api/src/app.module.ts` (ValidationPipe + глобальные настройки)

**Статус:** ✅ Завершено

# ✅ Шаг 4 — Загрузка изображений (Uploads)

## Что было сделано

Реализована полноценная загрузка изображений с раздачей статики.

### Что сделано:
- Добавлены зависимости: `@nestjs/serve-static`, `uuid`, `@types/multer`.
- Подключён `ServeStaticModule` — теперь `/uploads` доступен по HTTP.
- Создан отдельный `UploadModule` (чистая изоляция логики).
- `UploadController` + `FileInterceptor`:
  - Фильтрация только изображений (jpg, jpeg, png, gif, webp).
  - Генерация UUID-имени файла.
- `UploadService` — готов к замене на S3 (заглушка `processLocalUpload`).
- Обновлён `UploadResponseDto`.

## Файлы, которые были созданы
✅ apps/api/src/modules/upload/upload.module.ts
✅ apps/api/src/modules/upload/upload.controller.ts
✅ apps/api/src/modules/upload/upload.service.ts
✅ apps/api/src/app.module.ts (ServeStaticModule + UploadModule)
✅ /uploads/ (директория, добавлена в .gitignore)
## API
```http
POST /upload
Content-Type: multipart/form-data
```
→ { "imageUrl": "http://localhost:3011/uploads/9b1deb4d-...png" }
Статус: ✅ Завершено

# ✅ Шаг 5 — Редактирование тестов, UI и конфигурация окружения

## Что было сделано

### Backend
- CORS настроен через переменную `FRONTEND_PORT` + явный список методов (включая PUT, DELETE).
- Выделен отдельный `QuestionController` для PUT/DELETE вопросов.
- В `QuizService.findOne` добавлены `relations: ['questions']`.

### Frontend (Next.js + React)
- Переход на **Tailwind CSS v4** (с lightningcss).
- Абсолютные импорты `@/*`.
- Поддержка Next.js 15 (`await params`).
- Универсальный компонент `QuizForm` (create + edit через `initialData`).
- `QuestionCard` с возможностью замены изображения и удаления.
- Поддержка вставки изображений из буфера обмена (Ctrl+V).

## Файлы, которые были созданы / обновлены
✅ apps/api/src/main.ts
✅ apps/api/src/modules/quiz/question.controller.ts
✅ apps/api/src/modules/quiz/quiz.service.ts
✅ apps/web/package.json (Tailwind v4 + postcss)
✅ apps/web/tsconfig.json (paths @/*)
✅ apps/web/src/components/QuizForm.tsx
✅ apps/web/src/components/QuestionCard.tsx
✅ apps/web/app/quizzes/[id]/edit/page.tsx
✅ apps/web/src/lib/api.ts (методы put/delete)
**Статус:** ✅ Завершено

# ✅ Шаг 6 — Прохождение теста и проверка результатов

## Что было сделано

Реализован полный цикл прохождения теста учеником.

### Frontend
- Страница `/quiz/[id]`:
  - Поле `studentName` (обязательное).
  - Состояние `Record<number, string>` для ответов.
  - Кнопка «Завершить тест».
- Компонент `DiffHighlight` — цветовая подсветка символов:
  - `correct` — зелёный
  - `incorrect` — красный + подчёркивание
  - `extra` — красный фон
  - `missing` — серый
- Страница результата `/quiz/[id]/result` с итоговым score и детальным разбором каждого вопроса.

### Backend
- Улучшен `AttemptService`: нормализация + мгновенный расчёт score + diff.
- Расширена CORS-политика.

## Файлы, которые были обновлены
✅ apps/web/src/app/quiz/[id]/page.tsx
✅ apps/web/src/app/quiz/[id]/result/page.tsx
✅ apps/api/src/main.ts (CORS)
**Статус:** ✅ Завершено

# ✅ Шаг 7 — Рефакторинг, тестирование и инфраструктура

## Что было сделано

Финальный рефакторинг и подготовка проекта к дальнейшей разработке.

### Ключевые изменения:
- Полная миграция **Jest → Vitest** по всему монорепозиторию (тесты, UI-тесты, coverage).
- Рефакторинг роутинга: страницы создания/редактирования перенесены в `/edit-quiz/*`.
- Улучшение UX редактора:
  - Вставка изображений из буфера обмена (`ClipboardHandler`).
  - Временные `tempId` для новых вопросов.
  - Параллельное сохранение (`Promise.all`).
  - Уведомления `SuccessToast`.
- Удалён весь неиспользуемый boilerplate NestJS (`app.controller.ts`, `app.service.ts`, старые тесты).
- Исправлена инфраструктура:
  - `start.sh` / `reset.sh` — надёжное ожидание PostgreSQL.
  - `01-init.sql` — совместимость с TypeORM + динамический пользователь.
  - `docker-compose.dev.yml` — корректный проброс портов.

**Статус:** ✅ Завершено (проект полностью готов к разработке, тестированию и деплою)