import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, Question, QuizAttempt, AttemptAnswer } from '@spell/shared';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuestionService } from './question.service';
import { AttemptService } from './attempt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      QuizAttempt,
      AttemptAnswer,
    ]),
  ],
  controllers: [QuizController],
  providers: [QuizService, QuestionService, AttemptService],
  exports: [QuizService, QuestionService, AttemptService],
})
export class QuizModule {}
