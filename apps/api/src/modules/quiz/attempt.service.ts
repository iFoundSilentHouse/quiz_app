import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type {
  CreateAttemptDto,
  AttemptDto,
  AttemptWithResultsDto,
  AnswerResultDto,
  DiffCharDto,
} from "@spell/shared";
import { QuizAttempt, AttemptAnswer, Question } from "@spell/shared";

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

  async create(
    quizId: number,
    createAttemptDto: CreateAttemptDto,
  ): Promise<AttemptWithResultsDto> {
    // Получаем все вопросы теста
    const questions = await this.questionRepository.find({
      where: { quizId },
      order: { order: "ASC" },
    });

    if (!questions.length) {
      throw new NotFoundException(`No questions found for quiz ${quizId}`);
    }

    // Проверяем ответы и считаем score
    let score = 0;
    const answers: AttemptAnswer[] = [];

    for (const question of questions) {
      // КОРРЕКТНЫЙ ДОСТУП ДЛЯ Record<number, string>
      // Мы просто обращаемся к объекту по ID вопроса как по ключу
      const givenAnswer = createAttemptDto.answers[question.id] || "";

      const isCorrect = this.compareAnswers(
        givenAnswer,
        question.correctAnswer,
      );
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
      relations: ["answers", "answers.question"],
    });

    if (!fullAttempt) {
      throw new NotFoundException(
        `Failed to load attempt with id ${savedAttempt.id}`,
      );
    }

    return this.mapToAttemptWithResultsDto(fullAttempt, questions);
  }

  async findOne(id: number): Promise<AttemptWithResultsDto> {
    const attempt = await this.attemptRepository.findOne({
      where: { id },
      relations: ["answers", "answers.question"],
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
      order: { createdAt: "DESC" },
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
    const givenChars = given.split("");
    const correctChars = correct.split("");
    const diff: DiffCharDto[] = [];

    // Итерируемся именно по тому, что ВВЕЛ ученик
    for (let i = 0; i < givenChars.length; i++) {
      const char = givenChars[i];
      const expected = correctChars[i];

      if (char.toLowerCase() === expected?.toLowerCase()) {
        diff.push({ char, type: "correct", index: i });
      } else if (expected === undefined) {
        // Ученик ввел больше букв, чем в слове
        diff.push({ char, type: "extra", index: i });
      } else {
        // Буква на этом месте просто неверная
        diff.push({ char, type: "incorrect", index: i });
      }
    }

    // Опционально: если хочешь передавать информацию о пропущенных буквах
    // для другого компонента, можно добавить их в конец, но для "Ваш ответ"
    // мы их просто проигнорируем на фронте.

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
        // ОШИБКА БЫЛА ЗДЕСЬ:
        // 1. Заменяем ключ "correct" на "correctAnswer"
        correctAnswer: question?.correctAnswer || "",
        // 2. Добавляем недостающее поле "imageUrl"
        imageUrl: question?.imageUrl || "",
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
