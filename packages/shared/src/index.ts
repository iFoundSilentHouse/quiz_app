/**
 * @spell/shared
 * Общие типы, интерфейсы и entities для фронтенда и бэкенда
 */

// ============ DTOs ============
// Quiz DTOs
export * from './dtos/quiz.dto.js';

// Question DTOs
export * from './dtos/question.dto.js';

// Attempt DTOs
export * from './dtos/attempt.dto.js';

// Upload DTOs
export * from './dtos/upload.dto.js';

// ============ TypeORM Entities ============
// Entities для базы данных
export * from './entities/quiz.entity.js';
export * from './entities/question.entity.js';
export * from './entities/quiz-attempt.entity.js';
export * from './entities/attempt-answer.entity.js';
