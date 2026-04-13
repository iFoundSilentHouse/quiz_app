import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";
import { QuestionService } from "./question.service.js";

describe("QuestionService", () => {
  let service: QuestionService;

  // Мокаем репозитории
  const mockQuestionRepo = {
    create: vi.fn((dto) => ({ id: Math.random(), ...dto })),
    save: vi.fn((entity) =>
      Promise.resolve({
        ...entity,
        id: entity.id || 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
    find: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  const mockQuizRepo = {
    findOne: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Инжектим моки вручную
    service = new QuestionService(mockQuestionRepo as any, mockQuizRepo as any);
  });

  describe("create", () => {
    it("должен выбросить NotFoundException, если квиз не существует", async () => {
      mockQuizRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create(999, { correctAnswer: "test", order: 1, imageUrl: "" }),
      ).rejects.toThrow(NotFoundException);
    });

    it("должен создать и вернуть новый вопрос", async () => {
      mockQuizRepo.findOne.mockResolvedValue({ id: 1 });
      const dto = { correctAnswer: "Cat", order: 1, imageUrl: "cat.jpg" };

      const result = await service.create(1, dto);

      expect(mockQuestionRepo.create).toHaveBeenCalledWith({
        ...dto,
        quizId: 1,
      });
      expect(mockQuestionRepo.save).toHaveBeenCalled();
      expect(result.correctAnswer).toBe("Cat");
      expect(result).toHaveProperty("id");
    });
  });

  describe("update", () => {
    it("должен успешно обновить существующий вопрос", async () => {
      const existingQuestion = {
        id: 10,
        correctAnswer: "Old",
        order: 1,
        quizId: 1,
      };
      mockQuestionRepo.findOne.mockResolvedValue(existingQuestion);

      const updateDto = { correctAnswer: "New" };
      const result = await service.update(10, updateDto);

      expect(result.correctAnswer).toBe("New");
      // Проверяем, что Object.assign отработал и данные ушли в save
      expect(mockQuestionRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 10,
          correctAnswer: "New",
        }),
      );
    });

    it("должен кинуть 404 при обновлении несуществующего вопроса", async () => {
      mockQuestionRepo.findOne.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe("remove", () => {
    it("должен вызвать метод remove репозитория", async () => {
      const question = { id: 5 };
      mockQuestionRepo.findOne.mockResolvedValue(question);

      await service.remove(5);

      expect(mockQuestionRepo.remove).toHaveBeenCalledWith(question);
    });

    it("должен кинуть 404 если удалять нечего", async () => {
      mockQuestionRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByQuizId", () => {
    it("должен возвращать массив вопросов, отсортированных по order", async () => {
      const mockQuestions = [
        { id: 1, order: 1, quizId: 1 },
        { id: 2, order: 2, quizId: 1 },
      ];
      mockQuestionRepo.find.mockResolvedValue(mockQuestions);

      const result = await service.findByQuizId(1);

      expect(mockQuestionRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { quizId: 1 },
          order: { order: "ASC" },
        }),
      );
      expect(result).toHaveLength(2);
    });
  });
});
