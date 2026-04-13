import { Injectable } from "@nestjs/common";
import type { DiffCharDto } from "@spell/shared";

@Injectable()
export class AnswerCheckerService {
  /**
   * Сравнение строк (без учёта регистра и лишних пробелов)
   */
  compare(given: string, correct: string): boolean {
    return given.toLowerCase().trim() === correct.toLowerCase().trim();
  }

  /**
   * Посимвольный diff для подсветки ошибок
   */
  calculateDiff(given: string, correct: string): DiffCharDto[] {
    const givenNorm = given.toLowerCase().trim();
    const correctNorm = correct.toLowerCase().trim();
    const diff: DiffCharDto[] = [];
    const maxLen = Math.max(givenNorm.length, correctNorm.length);

    for (let i = 0; i < maxLen; i++) {
      const givenChar = givenNorm[i];
      const correctChar = correctNorm[i];

      if (givenChar === correctChar) {
        diff.push({ char: correctChar || "", type: "correct", index: i });
      } else if (givenChar === undefined) {
        diff.push({ char: correctChar, type: "missing", index: i });
      } else if (correctChar === undefined) {
        diff.push({ char: givenChar, type: "extra", index: i });
      } else {
        diff.push({ char: correctChar, type: "incorrect", index: i });
      }
    }
    return diff;
  }
}
