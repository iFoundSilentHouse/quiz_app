/**
 * Quiz DTOs
 * Используются для создания, обновления и получения тестов
 */

import type { QuestionDto } from './question.dto.js';

export interface CreateQuizDto {
  title: string;
  description?: string;
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
}

export interface QuizDto {
  id: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizWithQuestionsDto extends QuizDto {
  questions: QuestionDto[];
}
