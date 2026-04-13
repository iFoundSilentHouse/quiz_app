import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundException } from "@nestjs/common";
import { AttemptService } from "./attempt.service.js";

describe("AttemptService", () => {
  let service: AttemptService;

  // Создаем моки для репозиториев
  const mockAttemptRepo = {
    create: vi.fn((entity) => ({ id: 1, ...entity })),
    save: vi.fn((entity) => Promise.resolve({ id: 1, ...entity })),
    findOne: vi.fn(),
    find: vi.fn(),
  };

  const mockAnswerRepo = {
    create: vi.fn((entity) => entity),
  };

  const mockQuestionRepo = {
    find: vi.fn(),
  };

  beforeEach(() => {
    // Обнуляем вызовы моков перед каждым тестом
    vi.clearAllMocks();

    // Инициализируем сервис вручную (без NestJS DI контейнера)
    service = new AttemptService(
      mockAttemptRepo as any,
      mockAnswerRepo as any,
      mockQuestionRepo as any,
    );
  });

  describe("create", () => {
    it("должен выбросить NotFoundException, если в тесте нет вопросов", async () => {
      mockQuestionRepo.find.mockResolvedValue([]);

      await expect(
        service.create(1, { studentName: "Indigo", answers: {} }),
      ).rejects.toThrow(NotFoundException);
    });

    it("должен корректно считать score и сохранять попытку", async () => {
      // Подготовка данных
      const mockQuestions = [
        { id: 101, correctAnswer: "Apple", order: 1 },
        { id: 102, correctAnswer: "Banana", order: 2 },
      ];

      const createDto = {
        studentName: "Indigo",
        answers: {
          101: "apple", // Верно (регистр игнорируется)
          102: "orange", // Неверно
        },
      };

      mockQuestionRepo.find.mockResolvedValue(mockQuestions);

      // Имитируем сохранение и последующую загрузку из БД
      const savedAttempt = {
        id: 1,
        studentName: "Indigo",
        score: 1,
        quizId: 1,
        answers: [],
      };
      mockAttemptRepo.save.mockResolvedValue(savedAttempt);
      mockAttemptRepo.findOne.mockResolvedValue({
        ...savedAttempt,
        answers: [
          { questionId: 101, givenAnswer: "apple", isCorrect: true, diff: [] },
          {
            questionId: 102,
            givenAnswer: "orange",
            isCorrect: false,
            diff: [],
          },
        ],
      });

      const result = await service.create(1, createDto);

      // Проверки
      expect(result.score).toBe(1); // 1 из 2 правильно
      expect(result.studentName).toBe("Indigo");
      expect(mockAttemptRepo.save).toHaveBeenCalled();
      expect(mockAnswerRepo.create).toHaveBeenCalledTimes(2);
    });
  });

  describe("calculateDiff (private logic check)", () => {
    it("должен корректно помечать лишние буквы (extra)", () => {
      // Мы можем протестировать приватный метод через (service as any)
      // или просто вызвав публичный метод, который его использует
      const result = (service as any).calculateDiff("apples", "apple");

      expect(result).toHaveLength(6);
      expect(result[5]).toEqual({ char: "s", type: "extra", index: 5 });
    });

    it("должен корректно находить ошибки в середине слова", () => {
      const result = (service as any).calculateDiff("apXle", "apple");

      expect(result[2]).toEqual({ char: "X", type: "incorrect", index: 2 });
    });
  });

  describe("findOne", () => {
    it("должен кидать ошибку если попытка не найдена", async () => {
      mockAttemptRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
