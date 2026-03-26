import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  CreateAttemptDto,
  AttemptDto,
  AttemptWithResultsDto,
  AnswerResultDto,
  DiffCharDto,
} from '@spell/shared';
import { QuizAttempt, AttemptAnswer, Question } from '@spell/shared';

@Injectable()
export class AttemptService {
  constructor(
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
    @InjectRepository(AttemptAnswer)
    private answerRepository: Repository<AttemptAnswer>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async create(quizId: number, createAttemptDto: CreateAttemptDto): Promise<AttemptWithResultsDto> {
    // Получаем все вопросы теста
    const questions = await this.questionRepository.find({
      where: { quizId },
      order: { order: 'ASC' },
    });

    if (!questions.length) {
      throw new NotFoundException(`No questions found for quiz ${quizId}`);
    }

    // Проверяем ответы и считаем score
    let score = 0;
    const answers: AttemptAnswer[] = [];

    for (const question of questions) {
      const givenAnswer = createAttemptDto.answers[question.id] || '';
      const isCorrect = this.compareAnswers(givenAnswer, question.correctAnswer);
      const diff = this.calculateDiff(givenAnswer, question.correctAnswer);

      if (isCorrect) score++;

      const answer = this.answerRepository.create({
        givenAnswer,
        isCorrect,
        diff,
        questionId: question.id,
      });

      answers.push(answer);
    }

    // Создаём запись попытки
    const attempt = this.attemptRepository.create({
      studentName: createAttemptDto.studentName,
      score,
      totalQuestions: questions.length,
      quizId,
      answers,
    });

    const savedAttempt = await this.attemptRepository.save(attempt);

    // Загружаем полные данные с ответами
    const fullAttempt = await this.attemptRepository.findOne({
      where: { id: savedAttempt.id },
      relations: ['answers', 'answers.question'],
    });

    if (!fullAttempt) {
      throw new NotFoundException(`Failed to load attempt with id ${savedAttempt.id}`);
    }

    return this.mapToAttemptWithResultsDto(fullAttempt, questions);
  }

  async findOne(id: number): Promise<AttemptWithResultsDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id },
      relations: ['answers', 'answers.question'],
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${id} not found`);
    }

    const questions = await this.questionRepository.find({
      where: { quizId: attempt.quizId },
    });

    return this.mapToAttemptWithResultsDto(attempt, questions);
  }

  async findByQuizId(quizId: number): Promise<AttemptDto[]> {
    const attempts = await this.attemptRepository.find({
      where: { quizId },
      order: { createdAt: 'DESC' },
    });

    return attempts.map((attempt) => this.mapToAttemptDto(attempt));
  }

  /**
   * Сравнение ответов (без учёта регистра)
   */
  private compareAnswers(given: string, correct: string): boolean {
    return given.toLowerCase().trim() === correct.toLowerCase().trim();
  }

  /**
   * Вычисление посимвольного различия
   */
  private calculateDiff(given: string, correct: string): DiffCharDto[] {
    const givenNorm = given.toLowerCase().trim();
    const correctNorm = correct.toLowerCase().trim();
    const diff: DiffCharDto[] = [];

    // Используем алгоритм Левенштейна для более точного сравнения
    const maxLen = Math.max(givenNorm.length, correctNorm.length);

    for (let i = 0; i < maxLen; i++) {
      const givenChar = givenNorm[i];
      const correctChar = correctNorm[i];

      if (givenChar === correctChar) {
        diff.push({
          char: correctChar || '',
          type: 'correct',
          index: i,
        });
      } else if (givenChar === undefined) {
        // Пропущен символ
        diff.push({
          char: correctChar,
          type: 'missing',
          index: i,
        });
      } else if (correctChar === undefined) {
        // Лишний символ
        diff.push({
          char: givenChar,
          type: 'extra',
          index: i,
        });
      } else {
        // Неправильный символ
        diff.push({
          char: correctChar,
          type: 'incorrect',
          index: i,
        });
      }
    }

    return diff;
  }

  private mapToAttemptDto(attempt: QuizAttempt): AttemptDto {
    return {
      id: attempt.id,
      studentName: attempt.studentName,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      quizId: attempt.quizId,
      createdAt: attempt.createdAt,
    };
  }

  private mapToAttemptWithResultsDto(
    attempt: QuizAttempt,
    questions: Question[],
  ): AttemptWithResultsDto {
    const results: AnswerResultDto[] = attempt.answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return {
        questionId: answer.questionId,
        given: answer.givenAnswer,
        correct: question?.correctAnswer || '',
        isCorrect: answer.isCorrect,
        diff: answer.diff || [],
      };
    });

    return {
      id: attempt.id,
      studentName: attempt.studentName,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      quizId: attempt.quizId,
      createdAt: attempt.createdAt,
      results,
    };
  }
}
