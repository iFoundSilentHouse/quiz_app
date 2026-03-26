import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import type { CreateQuizDto, QuizDto, QuizWithQuestionsDto } from '@spell/shared';
import { QuizService } from './quiz.service';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto): Promise<QuizDto> {
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
}
