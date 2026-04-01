import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Quiz, Question, QuizAttempt, AttemptAnswer } from '@spell/shared';

// Загрузка переменных окружения
config({ path: '.env' });

// Получаем __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'indigo_user',
  password: process.env.DB_PASSWORD || 'secure_pass',
  database: process.env.DB_DATABASE || 'quiz_app',
  schema: 'spell_quiz',

  // Entities
  entities: [
    Quiz,
    Question,
    QuizAttempt,
    AttemptAnswer,
  ],

  // Пути к миграциям (для ts-node используем .ts файлы)
  migrations: [
    join(__dirname, './src/migrations/**/*.ts'),
  ],

  // Отключаем synchronize в production
  synchronize: false,

  // Логирование в development
  logging: process.env.NODE_ENV === 'development',

  // Дополнительные настройки
  migrationsRun: false, // Не запускать миграции автоматически
});