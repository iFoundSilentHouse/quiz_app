# @spell/shared

Пакет с общими типами, интерфейсами и DTOs, используемыми как фронтендом (`web`), так и бэкендом (`api`).

## Структура

```
src/
├── dtos/
│   ├── quiz.dto.ts       # DTOs для тестов
│   ├── question.dto.ts   # DTOs для вопросов
│   ├── attempt.dto.ts    # DTOs для попыток и результатов
│   └── upload.dto.ts     # DTOs для загрузки файлов
└── index.ts              # Re-exports всех типов
```

## Использование

### На бэкенде (Nest.js)

```typescript
import { CreateQuizDto, QuizWithQuestionsDto } from '@spell/shared';

@Controller('quizzes')
export class QuizzesController {
  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    // ...
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<QuizWithQuestionsDto> {
    // ...
  }
}
```

### На фронтенде (Next.js)

```typescript
import { QuizWithQuestionsDto, AttemptWithResultsDto } from '@spell/shared';

async function fetchQuiz(id: number): Promise<QuizWithQuestionsDto> {
  const res = await fetch(`/api/quizzes/${id}`);
  return res.json();
}
```

## DTOs

### Quiz
- `CreateQuizDto` — создание теста
- `UpdateQuizDto` — обновление теста
- `QuizDto` — базовые данные теста
- `QuizWithQuestionsDto` — тест с вопросами

### Question
- `CreateQuestionDto` — создание вопроса
- `UpdateQuestionDto` — обновление вопроса
- `QuestionDto` — полные данные вопроса (с ответом)
- `QuestionWithoutAnswerDto` — вопрос без ответа (для ученика)

### Attempt
- `CreateAttemptDto` — создание попытки (ответы ученика)
- `AttemptDto` — базовые данные попытки
- `AttemptWithResultsDto` — попытка с результатами и diff
- `AnswerResultDto` — результат одного ответа
- `DiffCharDto` — посимвольное сравнение

### Upload
- `UploadResponseDto` — ответ при загрузке файла
