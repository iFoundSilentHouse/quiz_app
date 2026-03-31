import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AttemptService } from './attempt.service.js';

@Controller('attempts')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  // Оставляем только этот метод для страницы результатов
  // GET /attempts/5
  @Get(':id')
  getResults(@Param('id', ParseIntPipe) id: number) {
    return this.attemptService.findOne(id);
  }
}