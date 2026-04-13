import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { QuizService } from './quiz.service.js';

describe('QuizService', () => {
  let service: QuizService;

  // Имитируем репозиторий Quiz
  const mockQuizRepo = {
    create: vi.fn(dto => ({ id: Math.random(), ...dto })),
    save: vi.fn(entity => Promise.resolve({ 
      ...entity, 
      id: entity.id || 1,
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    find: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new QuizService(mockQuizRepo as any);
  });

  describe('findAll', () => {
    it('должен возвращать список квизов, отсортированный по дате', async () => {
      const mockQuizzes = [
        { id: 1, title: 'Quiz 1', createdAt: new Date() },
        { id: 2, title: 'Quiz 2', createdAt: new Date() },
      ];
      mockQuizRepo.find.mockResolvedValue(mockQuizzes);

      const result = await service.findAll();

      expect(mockQuizRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Quiz 1');
    });
  });

  describe('findOne', () => {
    it('должен вернуть квиз вместе с отсортированными вопросами', async () => {
      const mockQuizWithQuestions = {
        id: 1,
        title: 'Full Quiz',
        questions: [
          { id: 10, order: 2, correctAnswer: 'B' },
          { id: 11, order: 1, correctAnswer: 'A' },
        ],
      };
      mockQuizRepo.findOne.mockResolvedValue(mockQuizWithQuestions);

      const result = await service.findOne(1);

      // Проверяем, что запрашиваются связи и сортировка
      expect(mockQuizRepo.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
        relations: ['questions'],
        order: { questions: { order: 'ASC' } }
      }));

      expect(result.questions).toHaveLength(2);
      expect(result.questions[0].id).toBe(10); // Проверяем наличие полей после маппинга
    });

    it('должен кинуть 404, если квиз не найден', async () => {
      mockQuizRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('должен обновлять данные квиза', async () => {
      const quiz = { id: 1, title: 'Old Title' };
      mockQuizRepo.findOne.mockResolvedValue(quiz);
      
      const updateDto = { title: 'New Title', description: 'New Desc' };
      const result = await service.update(1, updateDto);

      expect(result.title).toBe('New Title');
      expect(mockQuizRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Title'
      }));
    });
  });

  describe('remove', () => {
    it('должен успешно удалять квиз', async () => {
      const quiz = { id: 1 };
      mockQuizRepo.findOne.mockResolvedValue(quiz);

      await service.remove(1);

      expect(mockQuizRepo.remove).toHaveBeenCalledWith(quiz);
    });
  });
});