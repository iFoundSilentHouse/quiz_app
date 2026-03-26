import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Quiz } from './quiz.entity.js';
import type { AttemptAnswer } from './attempt-answer.entity.js';

@Entity('quiz_attempts')
@Index(['quizId', 'createdAt']) // Индекс для быстрого поиска попыток по тесту
export class QuizAttempt {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  studentName: string;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'integer' })
  totalQuestions: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Foreign Key
  @Column({ type: 'integer' })
  quizId: number;

  // Relations
  @ManyToOne('Quiz', 'attempts', {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany('AttemptAnswer', 'attempt', {
    cascade: true,
    eager: true, // Загружаем ответы вместе с попыткой
  })
  answers: AttemptAnswer[];
}
