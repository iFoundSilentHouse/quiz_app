/**
 * Question DTOs
 * Используются для создания, обновления и получения вопросов
 */

export interface CreateQuestionDto {
  imageUrl: string;
  correctAnswer: string;
  order: number;
}

export interface UpdateQuestionDto {
  imageUrl?: string;
  correctAnswer?: string;
  order?: number;
}

export interface QuestionDto {
  id: number;
  imageUrl: string;
  correctAnswer: string;
  order: number;
  quizId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionWithoutAnswerDto {
  id: number;
  imageUrl: string;
  order: number;
}
