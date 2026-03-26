/**
 * Attempt DTOs
 * Используются для создания и получения попыток прохождения тестов
 */

export interface AnswerResultDto {
  questionId: number;
  given: string;
  correct: string;
  isCorrect: boolean;
  diff: DiffCharDto[];
}

export interface DiffCharDto {
  char: string;
  type: 'correct' | 'incorrect' | 'missing' | 'extra';
  index: number;
}

export interface CreateAttemptDto {
  studentName: string;
  answers: Record<number, string>; // questionId -> given answer
}

export interface AttemptDto {
  id: number;
  studentName: string;
  score: number;
  totalQuestions: number;
  quizId: number;
  createdAt: Date;
}

export interface AttemptWithResultsDto extends AttemptDto {
  results: AnswerResultDto[];
}
