# 🗄️ Работа с базой данных

## Подключение к БД

### 1. Убедитесь, что PostgreSQL запущен

pnpm run db:start

### 2. Проверьте переменные окружения

Файл: `apps/api/.env`
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
```

### 3. Запустите миграции

```bash
cd apps/api
pnpm migration:run
```

## Миграции

### Структура файла миграции

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class YourMigration1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Код для применения миграции
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Код для отката миграции
  }
}
```

### Команды

```bash
# Запустить все миграции
pnpm migration:run

# Откатить последнюю миграцию
pnpm migration:revert

# Создать новую миграцию (после изменения entities)
pnpm migration:generate -- src/migrations/AddNewColumn

# Создать пустую миграцию
pnpm migration:create -- src/migrations/MyMigration
```

### Текущие миграции

#### 1705315200000-InitialSchema
Создаёт начальную схему БД:
- Таблица `quizzes`
- Таблица `questions`
- Таблица `quiz_attempts`
- Таблица `attempt_answers`

## Структура БД

### Schema: shared

```
┌─────────────────────────────────┐
│         QUIZZES                 │
├─────────────────────────────────┤
│ id (PK)                         │
│ title VARCHAR(100)              │
│ description TEXT                │
│ createdAt TIMESTAMP             │
│ updatedAt TIMESTAMP             │
└─────────────────────────────────┘
         ↓ 1:N
┌─────────────────────────────────┐
│       QUESTIONS                 │
├─────────────────────────────────┤
│ id (PK)                         │
│ imageUrl VARCHAR                │
│ correctAnswer VARCHAR(100)      │
│ order INTEGER                   │
│ quizId (FK)                     │
│ createdAt TIMESTAMP             │
│ updatedAt TIMESTAMP             │
│ INDEX: (quizId, order)          │
└─────────────────────────────────┘
         ↓ 1:N
┌──────────────────────────────────────┐
│    ATTEMPT_ANSWERS                   │
├──────────────────────────────────────┤
│ id (PK)                              │
│ givenAnswer VARCHAR(100)             │
│ isCorrect BOOLEAN                    │
│ diff JSONB                           │
│ attemptId (FK)                       │
│ questionId (FK)                      │
│ createdAt TIMESTAMP                  │
│ INDEX: (attemptId, questionId)       │
└──────────────────────────────────────┘
         ↑ 1:N
┌─────────────────────────────────┐
│    QUIZ_ATTEMPTS                │
├─────────────────────────────────┤
│ id (PK)                         │
│ studentName VARCHAR(100)        │
│ score INTEGER                   │
│ totalQuestions INTEGER          │
│ quizId (FK)                     │
│ createdAt TIMESTAMP             │
│ INDEX: (quizId, createdAt)      │
└─────────────────────────────────┘
```

## Примеры SQL запросов

### Получить все тесты учителя
```sql
SELECT * FROM shared.quizzes
ORDER BY createdAt DESC;
```

### Получить тест со всеми вопросами
```sql
SELECT q.*, json_agg(
  json_build_object(
    'id', qu.id,
    'imageUrl', qu.imageUrl,
    'correctAnswer', qu.correctAnswer,
    'order', qu.order
  )
) as questions
FROM shared.quizzes q
LEFT JOIN shared.questions qu ON q.id = qu.quizId
WHERE q.id = 1
GROUP BY q.id;
```

### Получить результаты попытки с diff
```sql
SELECT 
  qa.id,
  qa.studentName,
  qa.score,
  qa.totalQuestions,
  json_agg(
    json_build_object(
      'questionId', aa.questionId,
      'givenAnswer', aa.givenAnswer,
      'correctAnswer', q.correctAnswer,
      'isCorrect', aa.isCorrect,
      'diff', aa.diff
    )
  ) as results
FROM shared.quiz_attempts qa
LEFT JOIN shared.attempt_answers aa ON qa.id = aa.attemptId
LEFT JOIN shared.questions q ON aa.questionId = q.id
WHERE qa.id = 1
GROUP BY qa.id;
```

### Получить статистику по тесту
```sql
SELECT 
  COUNT(DISTINCT qa.id) as total_attempts,
  ROUND(AVG(qa.score::float / qa.totalQuestions * 100), 2) as avg_percentage,
  MAX(qa.score) as max_score,
  MIN(qa.score) as min_score
FROM shared.quiz_attempts qa
WHERE qa.quizId = 1;
```

## Backup и Restore

### Backup БД
```bash
pg_dump -U indigo -d quiz -h localhost > backup.sql
```

### Restore БД
```bash
psql -U indigo -d quiz -h localhost < backup.sql
```

## Troubleshooting

### Ошибка: "database quiz does not exist"
```bash
# Создайте БД вручную
psql -U indigo -h localhost
CREATE DATABASE quiz;
```

### Ошибка: "relation quizzes does not exist"
```bash
# Запустите миграции
pnpm migration:run
```

### Ошибка: "password authentication failed"
Проверьте учётные данные в `.env`:
```
DB_USERNAME=
DB_PASSWORD=
```

### Очистить все таблицы
```bash
# Откатить ВСЕ миграции (осторожно!)
pnpm migration:revert -- --to=0

# Затем запустить заново
pnpm migration:run
```

## Индексы

Для оптимизации производительности используются следующие индексы:

| Таблица | Индекс | Назначение |
|---------|--------|-----------|
| questions | (quizId, order) | Быстрый поиск вопросов по тесту и порядку |
| quiz_attempts | (quizId, createdAt) | Быстрый поиск попыток по тесту и дате |
| attempt_answers | (attemptId, questionId) | Быстрый поиск ответов по попытке и вопросу |

## Производительность

### Оптимизация запросов

1. **Используйте `relations` в TypeORM:**
```typescript
// ❌ Неправильно - N+1 проблема
const quizzes = await quizRepository.find();
for (const quiz of quizzes) {
  const questions = await questionRepository.find({ where: { quizId: quiz.id } });
}

// ✅ Правильно
const quiz = await quizRepository.findOne({
  where: { id: 1 },
  relations: ['questions'],
});
```

2. **Используйте `eager` для часто загружаемых relations:**
```typescript
@OneToMany(() => AttemptAnswer, (answer) => answer.attempt, {
  eager: true, // Всегда загружать ответы
})
answers: AttemptAnswer[];
```

3. **Используйте индексы для часто используемых полей.**

## Точка подключения DataSource

TypeORM DataSource инициализируется через Nest.js в `app.module.ts`:

```typescript
TypeOrmModule.forRootAsync({
  // ... конфигурация
})
```

Для прямого использования DataSource в сервисах:
```typescript
constructor(private dataSource: DataSource) {}

async customQuery() {
  return this.dataSource.query('SELECT * FROM shared.quizzes');
}
```
