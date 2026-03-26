import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { Question } from './question.entity.js';
import type { QuizAttempt } from './quiz-attempt.entity.js';

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relations
  @OneToMany('Question', 'quiz', {
    cascade: true,
    eager: false,
  })
  questions: Question[];

  @OneToMany('QuizAttempt', 'quiz', {
    cascade: true,
    eager: false,
  })
  attempts: QuizAttempt[];
}
