import { Controller, Body, Param, Put, Delete } from '@nestjs/common';
import { QuestionService } from './question.service.js';
import type { UpdateQuestionDto } from '@spell/shared';


@Controller('questions') // Обратите внимание на путь
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.questionService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}