import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import type { CreateAttemptDto, CreateQuestionDto, CreateQuizDto, QuestionDto, QuizDto, QuizWithQuestionsDto } from '@spell/shared';
import { QuizService } from './quiz.service.js';
import { QuestionService } from './question.service.js';
import { AttemptService } from './attempt.service.js';

@Controller('quizzes')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly questionService: QuestionService, // Внедряем сервис вопросов
    private readonly attemptService: AttemptService, 
  ) {}
  
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto): Promise<QuizDto> {
    console.log("createQuizDto: ", createQuizDto);
    return this.quizService.create(createQuizDto);
  }

  @Get()
  async findAll(): Promise<QuizDto[]> {
    return this.quizService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QuizWithQuestionsDto> {
    return this.quizService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: CreateQuizDto,
  ): Promise<QuizDto> {
    return this.quizService.update(+id, updateQuizDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.quizService.remove(+id);
  }

  @Post(':id/questions')
  async addQuestion(
    @Param('id') id: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<QuestionDto> {
    return this.questionService.create(+id, dto);
  }

  @Get(':id/questions')
  async getQuestions(@Param('id') id: string): Promise<QuestionDto[]> {
    return this.questionService.findByQuizId(+id);
  }

  @Post(':id/attempts')
  async submitAttempt(
    @Param('id', ParseIntPipe) quizId: number, 
    @Body() dto: CreateAttemptDto
  ) {
    // Теперь путь будет POST /quizzes/2/attempts
    return this.attemptService.create(quizId, dto);
  }
}
