import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, Question, QuizAttempt, AttemptAnswer } from '@spell/shared';
import { QuizController } from './quiz.controller.js';
import { QuizService } from './quiz.service.js';
import { QuestionService } from './question.service.js';
import { AttemptService } from './attempt.service.js';
import { AttemptController } from './attempt.controller.js';
import { AnswerCheckerService } from './answer-checker.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      QuizAttempt,
      AttemptAnswer,
    ]),
  ],
  controllers: [QuizController, AttemptController],
  providers: [
    QuizService, 
    QuestionService, 
    AttemptService, 
    AnswerCheckerService
  ],
  exports: [QuizService, QuestionService, AttemptService],
})
export class QuizModule {}
