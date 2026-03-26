import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Quiz } from './quiz.entity.js';
import type { AttemptAnswer } from './attempt-answer.entity.js';

@Entity('questions')
@Index(['quizId', 'order']) // Индекс для быстрого поиска вопросов по тесту и порядку
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({ type: 'varchar', length: 100 })
  correctAnswer: string;

  @Column({ type: 'integer' })
  order: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Foreign Key
  @Column({ type: 'integer' })
  quizId: number;

  // Relations
  @ManyToOne('Quiz', 'questions', {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  @OneToMany('AttemptAnswer', 'question', {
    cascade: true,
    eager: false,
  })
  answers: AttemptAnswer[];
}
