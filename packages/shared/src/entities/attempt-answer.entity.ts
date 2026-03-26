import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { QuizAttempt } from './quiz-attempt.entity.js';
import type { Question } from './question.entity.js';

@Entity('attempt_answers')
@Index(['attemptId', 'questionId']) // Комбинированный индекс для быстрого поиска
export class AttemptAnswer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  givenAnswer: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'json', nullable: true })
  diff: DiffCharData[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Foreign Keys
  @Column({ type: 'integer' })
  attemptId: number;

  @Column({ type: 'integer' })
  questionId: number;

  // Relations
  @ManyToOne('QuizAttempt', 'answers', {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'attemptId' })
  attempt: QuizAttempt;

  @ManyToOne('Question', 'answers', {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}

/**
 * Структура для хранения посимвольного сравнения
 */
export interface DiffCharData {
  char: string;
  type: 'correct' | 'incorrect' | 'missing' | 'extra';
  index: number;
}
