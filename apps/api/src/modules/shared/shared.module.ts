import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz, Question, QuizAttempt, AttemptAnswer } from '@spell/shared';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      Question,
      QuizAttempt,
      AttemptAnswer,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class SharedModule {}
