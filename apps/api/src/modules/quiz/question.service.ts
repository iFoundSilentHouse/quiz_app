import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CreateQuestionDto, QuestionDto } from "@spell/shared";
import { Question, Quiz } from "@spell/shared";

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {}

  async create(
    quizId: number,
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDto> {
    // Проверяем, существует ли тест
    const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
    if (!quiz) {
      throw new NotFoundException(`Quiz with id ${quizId} not found`);
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      quizId,
    });

    const savedQuestion = await this.questionRepository.save(question);
    return this.mapToQuestionDto(savedQuestion);
  }

  async findByQuizId(quizId: number): Promise<QuestionDto[]> {
    const questions = await this.questionRepository.find({
      where: { quizId },
      order: { order: "ASC" },
    });
    return questions.map((q) => this.mapToQuestionDto(q));
  }

  async findOne(id: number): Promise<QuestionDto> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return this.mapToQuestionDto(question);
  }

  async update(
    id: number,
    updateQuestionDto: Partial<CreateQuestionDto>,
  ): Promise<QuestionDto> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    Object.assign(question, updateQuestionDto);
    const updatedQuestion = await this.questionRepository.save(question);
    return this.mapToQuestionDto(updatedQuestion);
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    await this.questionRepository.remove(question);
  }

  private mapToQuestionDto(question: Question): QuestionDto {
    return {
      id: question.id,
      imageUrl: question.imageUrl,
      correctAnswer: question.correctAnswer,
      order: question.order,
      quizId: question.quizId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
