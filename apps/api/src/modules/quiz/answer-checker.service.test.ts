import { describe, it, expect, beforeEach } from "vitest";
import { AnswerCheckerService } from "./answer-checker.service.js";

describe("AnswerCheckerService", () => {
  let service: AnswerCheckerService;

  beforeEach(() => {
    service = new AnswerCheckerService();
  });

  describe("compare", () => {
    it("должен возвращать true для идентичных строк", () => {
      expect(service.compare("Привет", "привет ")).toBe(true);
    });

    it("должен возвращать false для разных строк", () => {
      expect(service.compare("Яблоко", "Груша")).toBe(false);
    });

    it("должен игнорировать лишние пробелы и регистр", () => {
      expect(service.compare("  NestJS  ", "nestjs")).toBe(true);
    });
  });

  describe("calculateDiff", () => {
    it("должен корректно определять правильные символы", () => {
      const result = service.calculateDiff("abc", "abc");
      expect(result.every((d) => d.type === "correct")).toBe(true);
      expect(result).toHaveLength(3);
    });

    it("должен подсвечивать пропущенные символы (missing)", () => {
      const result = service.calculateDiff("ab", "abc"); // 'c' пропущена
      expect(result[2]).toEqual({ char: "c", type: "missing", index: 2 });
    });

    it("должен подсвечивать лишние символы (extra)", () => {
      const result = service.calculateDiff("abcd", "abc"); // 'd' лишняя
      expect(result[3]).toEqual({ char: "d", type: "extra", index: 3 });
    });

    it("должен подсвечивать неправильные символы (incorrect)", () => {
      const result = service.calculateDiff("axc", "abc"); // 'x' вместо 'b'
      expect(result[1]).toEqual({ char: "b", type: "incorrect", index: 1 });
    });
  });
});
