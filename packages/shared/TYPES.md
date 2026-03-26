# Типы и структура данных

## Диаграмма сущностей

```
┌─────────────────────────────────────────────────────────────────┐
│                         QUIZ (Тест)                              │
│  ├─ id: number                                                   │
│  ├─ title: string                                                │
│  ├─ description?: string                                         │
│  ├─ createdAt: Date                                              │
│  └─ updatedAt: Date                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 1:N
┌─────────────────────────────────────────────────────────────────┐
│                      QUESTION (Вопрос)                            │
│  ├─ id: number                                                   │
│  ├─ imageUrl: string                                             │
│  ├─ correctAnswer: string                                        │
│  ├─ order: number                                                │
│  ├─ quizId: number (FK)                                          │
│  ├─ createdAt: Date                                              │
│  └─ updatedAt: Date                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    QUIZ ATTEMPT (Попытка)                        │
│  ├─ id: number                                                   │
│  ├─ studentName: string                                          │
│  ├─ score: number                                                │
│  ├─ totalQuestions: number                                       │
│  ├─ quizId: number (FK)                                          │
│  └─ createdAt: Date                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ 1:N
┌─────────────────────────────────────────────────────────────────┐
│                   ATTEMPT ANSWER (Ответ)                         │
│  ├─ id: number                                                   │
│  ├─ givenAnswer: string (ответ ученика)                         │
│  ├─ isCorrect: boolean                                           │
│  ├─ attemptId: number (FK)                                       │
│  ├─ questionId: number (FK)                                      │
│  └─ diff: DiffChar[] (посимвольное сравнение)                    │
└─────────────────────────────────────────────────────────────────┘
```

## DTOs для API

### 1. Quiz DTOs

#### `CreateQuizDto`
Используется при создании нового теста.
```typescript
{
  title: "Фрукты",
  description: "Тест на названия фруктов"
}
```

#### `QuizDto`
Базовые данные теста без вопросов.
```typescript
{
  id: 1,
  title: "Фрукты",
  description: "Тест на названия фруктов",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

#### `QuizWithQuestionsDto`
Тест со всеми вопросами (используется при получении полного теста).
```typescript
{
  id: 1,
  title: "Фрукты",
  description: "Тест на названия фруктов",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  questions: [
    {
      id: 1,
      imageUrl: "/uploads/apple.jpg",
      correctAnswer: "apple",
      order: 1,
      quizId: 1,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    }
  ]
}
```

### 2. Question DTOs

#### `CreateQuestionDto`
Используется при добавлении вопроса в тест.
```typescript
{
  imageUrl: "/uploads/apple.jpg",
  correctAnswer: "apple",
  order: 1
}
```

#### `QuestionDto`
Полные данные вопроса с правильным ответом (только для учителя).
```typescript
{
  id: 1,
  imageUrl: "/uploads/apple.jpg",
  correctAnswer: "apple",
  order: 1,
  quizId: 1,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

#### `QuestionWithoutAnswerDto`
Вопрос без правильного ответа (для ученика при прохождении теста).
```typescript
{
  id: 1,
  imageUrl: "/uploads/apple.jpg",
  order: 1
}
```

### 3. Attempt DTOs

#### `CreateAttemptDto`
Используется при отправке результатов попытки.
```typescript
{
  studentName: "Иван Петров",
  answers: {
    1: "apple",      // questionId -> answer
    2: "orange",
    3: "banan"       // ошибка вместо "banana"
  }
}
```

#### `DiffCharDto`
Описание различия в одном символе.
```typescript
{
  char: "a",                // символ из правильного ответа
  type: "correct",          // correct | incorrect | missing | extra
  index: 0                  // позиция в слове
}
```

**Типы различий:**
- `correct` — символ совпадает
- `incorrect` — ученик ввел другой символ
- `missing` — символ пропущен (есть в правильном ответе, но нет в ответе ученика)
- `extra` — лишний символ (есть в ответе ученика, но нет в правильном ответе)

#### `AnswerResultDto`
Результат проверки одного ответа.
```typescript
{
  questionId: 3,
  given: "banan",
  correct: "banana",
  isCorrect: false,
  diff: [
    { char: "b", type: "correct", index: 0 },
    { char: "a", type: "correct", index: 1 },
    { char: "n", type: "correct", index: 2 },
    { char: "a", type: "correct", index: 3 },
    { char: "n", type: "missing", index: 4 }
  ]
}
```

#### `AttemptDto`
Базовые данные попытки.
```typescript
{
  id: 1,
  studentName: "Иван Петров",
  score: 2,            // количество правильных ответов
  totalQuestions: 3,   // всего вопросов
  quizId: 1,
  createdAt: "2024-01-15T10:30:00Z"
}
```

#### `AttemptWithResultsDto`
Полные результаты попытки с деталями каждого ответа.
```typescript
{
  id: 1,
  studentName: "Иван Петров",
  score: 2,
  totalQuestions: 3,
  quizId: 1,
  createdAt: "2024-01-15T10:30:00Z",
  results: [
    {
      questionId: 1,
      given: "apple",
      correct: "apple",
      isCorrect: true,
      diff: [
        { char: "a", type: "correct", index: 0 },
        { char: "p", type: "correct", index: 1 },
        { char: "p", type: "correct", index: 2 },
        { char: "l", type: "correct", index: 3 },
        { char: "e", type: "correct", index: 4 }
      ]
    },
    // ... остальные результаты
  ]
}
```

### 4. Upload DTOs

#### `UploadResponseDto`
Ответ при успешной загрузке файла.
```typescript
{
  imageUrl: "/uploads/1234567890-apple.jpg",
  filename: "1234567890-apple.jpg"
}
```

## Правила валидации

### Quiz
- `title` — обязательное, 1-100 символов
- `description` — опциональное, макс 500 символов

### Question
- `imageUrl` — обязательное, валидный URL
- `correctAnswer` — обязательное, 1-50 символов
- `order` — обязательное, положительное число

### Attempt
- `studentName` — обязательное, 1-100 символов
- `answers` — обязательное, минимум 1 ответ

### Upload
- Файл — только изображения (jpg, png, webp), макс 5MB
