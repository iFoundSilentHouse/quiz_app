import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttemptService } from './attempt.service.js';
import type { CreateAttemptDto } from '@spell/shared';

@Controller('attempts')
export class AttemptController {
  constructor(private readonly attemptService: AttemptService) {}

  @Post('quiz/:quizId')
  submit(@Param('quizId') quizId: number, @Body() dto: CreateAttemptDto) {
    return this.attemptService.create(quizId, dto);
  }

  @Get(':id')
  getResults(@Param('id') id: number) {
    return this.attemptService.findOne(id);
  }
}