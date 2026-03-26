// Barrel file для избежания циклических импортов
// Экспортируем все entities одновременно

export { Quiz } from './entities/quiz.entity.js';
export { Question } from './entities/question.entity.js';
export { QuizAttempt } from './entities/quiz-attempt.entity.js';
export { AttemptAnswer, type DiffCharData } from './entities/attempt-answer.entity.js';
