import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type {
  CreateQuizDto,
  QuizDto,
  QuizWithQuestionsDto,
} from "@spell/shared";
import { Quiz } from "@spell/shared";

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<QuizDto> {
    const quiz = this.quizRepository.create(createQuizDto);
    const savedQuiz = await this.quizRepository.save(quiz);
    return this.mapToQuizDto(savedQuiz);
  }

  async findAll(): Promise<QuizDto[]> {
    const quizzes = await this.quizRepository.find({
      order: { createdAt: "DESC" },
    });
    return quizzes.map((quiz) => this.mapToQuizDto(quiz));
  }

  async findOne(id: number): Promise<QuizWithQuestionsDto> {
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations: ["questions"],
      order: { questions: { order: "ASC" } },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    return this.mapToQuizWithQuestionsDto(quiz);
  }

  async update(id: number, updateQuizDto: CreateQuizDto): Promise<QuizDto> {
    const quiz = await this.quizRepository.findOne({ where: { id } });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    Object.assign(quiz, updateQuizDto);
    const updatedQuiz = await this.quizRepository.save(quiz);
    return this.mapToQuizDto(updatedQuiz);
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.quizRepository.findOne({ where: { id } });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${id} not found`);
    }

    await this.quizRepository.remove(quiz);
  }

  private mapToQuizDto(quiz: Quiz): QuizDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };
  }

  private mapToQuizWithQuestionsDto(quiz: Quiz): QuizWithQuestionsDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        imageUrl: question.imageUrl,
        correctAnswer: question.correctAnswer,
        order: question.order,
        quizId: question.quizId,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      })),
    };
  }
}
