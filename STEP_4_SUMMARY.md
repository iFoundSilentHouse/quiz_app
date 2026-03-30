# ✅ Шаг 4 — Загрузка изображений (Uploads)

## Что было сделано

### 1. Установка зависимостей
Добавлены пакеты для работы со статикой и генерации уникальных идентификаторов файлов:
* `@nestjs/serve-static` — для раздачи загруженных файлов сервером.
* `uuid` — для генерации безопасных и уникальных имен файлов.
* `@types/multer`, `@types/uuid` — типы для TypeScript.

### 2. Настройка раздачи статики
В `AppModule` подключен и настроен `ServeStaticModule`. Теперь Nest.js работает как файловый сервер для папки `uploads`.
```typescript
ServeStaticModule.forRoot({
  rootPath: join(process.cwd(), 'uploads'),
  serveRoot: '/uploads',
})

3. Создание модуля Upload

Создан изолированный UploadModule для обработки файлов. Логика разделена так, чтобы в будущем легко переключиться с локального хранения на Amazon S3.
Контроллер (UploadController)

    Реализован эндпоинт для приема файлов через multipart/form-data.

    Интегрирован FileInterceptor (Multer).

    Добавлена генерация UUID-имен для предотвращения перезаписи файлов с одинаковыми названиями (uuidv4() + ext).

    Настроена фильтрация: сервер принимает только графические форматы (jpg, jpeg, png, gif, webp). В случае загрузки других форматов выбрасывается BadRequestException.

Сервис (UploadService)

    Инкапсулирована логика формирования итогового URL файла.

    Подготовлена база (заглушка processLocalUpload) для будущей интеграции с aws-sdk (S3 Bucket).

4. Интеграция с DTO

Обновлен DTO-контракт в @spell/shared для типизации ответа сервера.
TypeScript

export interface UploadResponseDto {
  imageUrl: string;
}

Структура добавленных файлов
Plaintext

apps/api/src/
├── app.module.ts                   (обновлен: ServeStaticModule, UploadModule)
└── modules/
    └── upload/
        ├── upload.module.ts        (новый)
        ├── upload.controller.ts    (новый)
        └── upload.service.ts       (новый)

/uploads/                           (создана директория для хранения файлов. Добавлена в .gitignore)

API Эндпоинты
Upload
HTTP

POST /upload
Content-Type: multipart/form-data

Body:
  file: <binary image data>

Успешный ответ (201 Created):
JSON

{
  "imageUrl": "http://localhost:3011/uploads/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.png"
}

Как использовать

Полученный из POST /upload строковый параметр imageUrl передается в тело запроса при создании вопроса для теста:
HTTP

POST /quizzes/:id/questions
{
  "imageUrl": "http://localhost:3011/uploads/...",
  "correctAnswer": "word",
  "order": 1
}