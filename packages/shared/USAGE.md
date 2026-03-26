# Использование @spell/shared

## Установка зависимостей

Зависимость уже добавлена в `package.json` обоих приложений. Просто запустите:

```bash
pnpm install
```

## Импорт типов

### В Nest.js (Backend)

```typescript
// src/quizzes/dto/create-quiz.dto.ts
import { CreateQuizDto, QuizWithQuestionsDto } from '@spell/shared';

@Controller('quizzes')
export class QuizzesController {
  @Post()
  create(@Body() dto: CreateQuizDto): Promise<QuizDto> {
    // ...
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<QuizWithQuestionsDto> {
    // ...
  }
}
```

### В Next.js (Frontend)

```typescript
// app/quiz/[id]/page.tsx
import { QuizWithQuestionsDto, AttemptWithResultsDto } from '@spell/shared';

async function QuizPage({ params }: { params: { id: string } }) {
  const quiz: QuizWithQuestionsDto = await fetch(
    `http://localhost:3000/api/quizzes/${params.id}`
  ).then(r => r.json());

  return (
    <div>
      <h1>{quiz.title}</h1>
      {quiz.questions.map(q => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
```

## Примеры API эндпоинтов

### Создание теста (Teacher)
```bash
POST /api/quizzes
Content-Type: application/json

{
  "title": "Фрукты",
  "description": "Тест на названия фруктов"
}

# Response: QuizDto
```

### Добавление вопроса
```bash
POST /api/quizzes/:id/questions
Content-Type: application/json

{
  "imageUrl": "/uploads/apple.jpg",
  "correctAnswer": "apple",
  "order": 1
}

# Response: QuestionDto
```

### Получение теста с вопросами
```bash
GET /api/quizzes/:id

# Response: QuizWithQuestionsDto
```

### Загрузка картинки
```bash
POST /api/upload
Content-Type: multipart/form-data

file: <binary image data>

# Response: UploadResponseDto
{
  "imageUrl": "/uploads/1234567890-apple.jpg",
  "filename": "1234567890-apple.jpg"
}
```

### Прохождение теста (Student)
```bash
POST /api/quizzes/:id/attempts
Content-Type: application/json

{
  "studentName": "Иван Петров",
  "answers": {
    "1": "apple",
    "2": "orange",
    "3": "banan"
  }
}

# Response: AttemptWithResultsDto
{
  "id": 1,
  "studentName": "Иван Петров",
  "score": 2,
  "totalQuestions": 3,
  "quizId": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "results": [...]
}
```

### Получение результатов попытки
```bash
GET /api/attempts/:id

# Response: AttemptWithResultsDto
```

## Структура проекта после Шага 1

```
packages/shared/
├── src/
│   ├── dtos/
│   │   ├── quiz.dto.ts
│   │   ├── question.dto.ts
│   │   ├── attempt.dto.ts
│   │   └── upload.dto.ts
│   └── index.ts
├── dist/                  # Скомпилированные файлы
├── package.json
├── tsconfig.json
├── README.md             # Описание пакета
├── TYPES.md              # Полная документация типов
└── USAGE.md              # Этот файл

apps/api/
├── package.json          # Добавлена зависимость на @spell/shared
└── src/

apps/web/
├── package.json          # Добавлена зависимость на @spell/shared
└── app/
```

## Что дальше?

Шаг 1 завершен! ✅

Следующий шаг (Шаг 2):
- Настройка PostgreSQL через Docker Compose
- Подключение TypeORM к Nest.js
- Создание сущностей (entities) базы данных

Команды для проверки:

```bash
# Собрать пакет shared
pnpm build --filter @spell/shared

# Проверить типы
pnpm check-types

# Посмотреть сгенерированные файлы
ls -la packages/shared/dist/
```

## Полезные ссылки

- [TypeScript](https://www.typescriptlang.org/)
- [Nest.js Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeORM Documentation](https://typeorm.io/)
