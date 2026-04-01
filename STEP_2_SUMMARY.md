# ✅ Шаг 2 — База данных и ORM

## Что было сделано

### 1. Создание TypeORM Entities в `packages/shared/src/entities/`

#### Quiz Entity
```typescript
@Entity('quizzes')
class Quiz {
  id: number                    // PrimaryGeneratedColumn
  title: string                 // varchar(100)
  description?: string          // text
  createdAt: Date              // timestamp
  updatedAt: Date              // timestamp
  questions: Question[]         // OneToMany
  attempts: QuizAttempt[]       // OneToMany
}
```

#### Question Entity
```typescript
@Entity('questions')
@Index(['quizId', 'order'])    // Индекс для быстрого поиска
class Question {
  id: number                    // PrimaryGeneratedColumn
  imageUrl: string              // varchar
  correctAnswer: string         // varchar(100)
  order: number                 // integer
  quizId: number               // FK -> Quiz
  createdAt: Date              // timestamp
  updatedAt: Date              // timestamp
  quiz: Quiz                    // ManyToOne
  answers: AttemptAnswer[]      // OneToMany
}
```

#### QuizAttempt Entity
```typescript
@Entity('quiz_attempts')
@Index(['quizId', 'createdAt']) // Индекс для быстрого поиска
class QuizAttempt {
  id: number                    // PrimaryGeneratedColumn
  studentName: string           // varchar(100)
  score: number                 // integer
  totalQuestions: number        // integer
  quizId: number               // FK -> Quiz
  createdAt: Date              // timestamp
  quiz: Quiz                    // ManyToOne
  answers: AttemptAnswer[]      // OneToMany (eager: true)
}
```

#### AttemptAnswer Entity
```typescript
@Entity('attempt_answers')
@Index(['attemptId', 'questionId']) // Комбинированный индекс
class AttemptAnswer {
  id: number                    // PrimaryGeneratedColumn
  givenAnswer: string           // varchar(100)
  isCorrect: boolean            // boolean
  diff: DiffCharData[]          // jsonb
  attemptId: number            // FK -> QuizAttempt
  questionId: number           // FK -> Question
  createdAt: Date              // timestamp
  attempt: QuizAttempt         // ManyToOne
  question: Question           // ManyToOne
}
```

### 2. Настройка TypeORM в Nest.js

**Файлы:**
- `apps/api/typeorm.config.ts` — конфигурация DataSource
- `apps/api/src/app.module.ts` — подключение TypeOrmModule

### 3. Создание первой миграции

**Файл:** `apps/api/src/migrations/1705315200000-InitialSchema.ts`

Миграция создаёт:
- Таблица `quizzes` с полями title, description, timestamps
- Таблица `questions` с FK на quizzes, индекс (quizId, order)
- Таблица `quiz_attempts` с FK на quizzes, индекс (quizId, createdAt)
- Таблица `attempt_answers` с FK на quiz_attempts и questions, индекс (attemptId, questionId)
- Все внешние ключи с `ON DELETE CASCADE`

### 4. Создание модулей Nest.js

#### SharedModule
```
apps/api/src/modules/shared/shared.module.ts
├─ Импортирует TypeOrmModule с entities
└─ Экспортирует TypeOrmModule для использования в других модулях
```

#### QuizModule
```
apps/api/src/modules/quiz/
├─ quiz.module.ts        (конфигурация модуля)
├─ quiz.controller.ts    (REST API эндпоинты)
├─ quiz.service.ts       (бизнес-логика тестов)
├─ question.service.ts   (бизнес-логика вопросов)
└─ attempt.service.ts    (бизнес-логика попыток)
```

### 5. Реализованные сервисы

#### QuizService
- `create(createQuizDto)` — создать тест
- `findAll()` — получить все тесты
- `findOne(id)` — получить тест с вопросами
- `update(id, updateQuizDto)` — обновить тест
- `remove(id)` — удалить тест

#### QuestionService
- `create(quizId, createQuestionDto)` — добавить вопрос
- `findByQuizId(quizId)` — получить вопросы теста
- `findOne(id)` — получить вопрос
- `update(id, updateQuestionDto)` — обновить вопрос
- `remove(id)` — удалить вопрос

#### AttemptService
- `create(quizId, createAttemptDto)` — сохранить попытку ученика
  - Проверяет ответы (без учёта регистра и пробелов)
  - Считает score
  - Вычисляет посимвольное diff
- `findOne(id)` — получить результаты попытки
- `findByQuizId(quizId)` — получить все попытки теста

### 6. Реализован алгоритм проверки ответов

**AttemptService.calculateDiff():**
- Сравнивает строки посимвольно
- Определяет типы различий:
  - `correct` — символ совпадает
  - `incorrect` — неправильный символ
  - `missing` — пропущен символ
  - `extra` — лишний символ

**Пример:**
```
Правильный: "banana"
Ученик:     "banan"
Diff:       [
  { char: "b", type: "correct", index: 0 },
  { char: "a", type: "correct", index: 1 },
  { char: "n", type: "correct", index: 2 },
  { char: "a", type: "correct", index: 3 },
  { char: "n", type: "missing", index: 4 }
]
```

### 7. Обновлена конфигурация

**`.env`** (для API):

**`packages/shared/tsconfig.json`:**
- Добавлены флаги для TypeORM:
  - `experimentalDecorators: true`
  - `emitDecoratorMetadata: true`
  - `strictPropertyInitialization: false`

## Файлы, которые были созданы

```
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

✅ apps/api/.env (обновлён)
```

## Файлы, которые были отредактированы

```
✅ packages/shared/src/index.ts (добавлены exports entities)
✅ packages/shared/package.json (добавлена typeorm как peerDependency)
✅ packages/shared/tsconfig.json (обновлены компилятор опции)
✅ apps/api/typeorm.config.ts (обновлена конфигурация)
✅ apps/api/src/app.module.ts (обновлены импорты и конфигурация)
```

## Проверка

Проект успешно собрался:
```bash
$ cd apps/api && npm run build
# ✅ Без ошибок!
```

## Структура БД после миграции

```
Database: quiz
Schema: shared

Tables:
├── quizzes
│   ├── id (PK)
│   ├── title (varchar)
│   ├── description (text, nullable)
│   ├── createdAt (timestamp)
│   └── updatedAt (timestamp)
│
├── questions
│   ├── id (PK)
│   ├── imageUrl (varchar)
│   ├── correctAnswer (varchar)
│   ├── order (integer)
│   ├── quizId (FK -> quizzes.id)
│   ├── createdAt (timestamp)
│   ├── updatedAt (timestamp)
│   └── INDEX (quizId, order)
│
├── quiz_attempts
│   ├── id (PK)
│   ├── studentName (varchar)
│   ├── score (integer)
│   ├── totalQuestions (integer)
│   ├── quizId (FK -> quizzes.id)
│   ├── createdAt (timestamp)
│   └── INDEX (quizId, createdAt)
│
└── attempt_answers
    ├── id (PK)
    ├── givenAnswer (varchar)
    ├── isCorrect (boolean)
    ├── diff (jsonb)
    ├── attemptId (FK -> quiz_attempts.id)
    ├── questionId (FK -> questions.id)
    ├── createdAt (timestamp)
    └── INDEX (attemptId, questionId)
```

## API Эндпоинты (реализованы)

### Quizzes
```
POST   /quizzes              - Создать тест
GET    /quizzes              - Получить все тесты
GET    /quizzes/:id          - Получить тест с вопросами
PUT    /quizzes/:id          - Обновить тест
DELETE /quizzes/:id          - Удалить тест
```

### Questions
```
POST   /quizzes/:id/questions      - Добавить вопрос
GET    /quizzes/:id/questions      - Получить вопросы теста
GET    /questions/:id              - Получить вопрос
PUT    /questions/:id              - Обновить вопрос
DELETE /questions/:id              - Удалить вопрос
```

### Attempts
```
POST   /quizzes/:id/attempts  - Сохранить попытку (проверить ответы)
GET    /attempts/:id          - Получить результаты попытки
GET    /quizzes/:id/attempts  - Получить все попытки теста
```

## Следующий шаг

**Шаг 3 — Backend API (Nest.js)**
- Добавить контроллеры для вопросов и попыток
- Добавить валидацию DTO с `class-validator`
- Добавить обработку ошибок
- Добавить загрузку файлов (multipart/form-data)
- Создать DataSource провайдер для миграций

## Команды

```bash
# Установить зависимости
pnpm install

# Собрать проект
pnpm build

# Проверить типы
pnpm check-types

# Запустить миграции
npm run typeorm migration:run

# Создать новую миграцию
npm run typeorm migration:generate -- src/migrations/YourMigrationName

# Откатить последнюю миграцию
npm run typeorm migration:revert
```

---

**Статус:** ✅ Завершено

**Дата:** 2024
