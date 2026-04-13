import type { MigrationInterface, QueryRunner } from "typeorm";
import { Table, TableForeignKey, TableIndex } from "typeorm";

export class InitialSchema1705315200001 implements MigrationInterface {
  name = "InitialSchema1705315200001";
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание таблицы quizzes
    await queryRunner.createTable(
      new Table({
        name: "quizzes",
        schema: "spell_quiz",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: true,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Создание таблицы questions
    await queryRunner.createTable(
      new Table({
        name: "questions",
        schema: "spell_quiz",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "imageUrl",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "correctAnswer",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "order",
            type: "integer",
            isNullable: false,
          },
          {
            name: "quizId",
            type: "integer",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Добавление внешнего ключа для questions
    await queryRunner.createForeignKey(
      "questions",
      new TableForeignKey({
        columnNames: ["quizId"],
        referencedColumnNames: ["id"],
        referencedTableName: "quizzes",
        referencedSchema: "spell_quiz",
        onDelete: "CASCADE",
        name: "FK_questions_quizId",
      }),
    );

    // Добавление индекса для questions
    await queryRunner.createIndex(
      "questions",
      new TableIndex({
        name: "IDX_questions_quizId_order",
        columnNames: ["quizId", "order"],
      }),
    );

    // Создание таблицы quiz_attempts
    await queryRunner.createTable(
      new Table({
        name: "quiz_attempts",
        schema: "spell_quiz",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "studentName",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "score",
            type: "integer",
            isNullable: false,
          },
          {
            name: "totalQuestions",
            type: "integer",
            isNullable: false,
          },
          {
            name: "quizId",
            type: "integer",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Добавление внешнего ключа для quiz_attempts
    await queryRunner.createForeignKey(
      "quiz_attempts",
      new TableForeignKey({
        columnNames: ["quizId"],
        referencedColumnNames: ["id"],
        referencedTableName: "quizzes",
        referencedSchema: "spell_quiz",
        onDelete: "CASCADE",
        name: "FK_quiz_attempts_quizId",
      }),
    );

    // Добавление индекса для quiz_attempts
    await queryRunner.createIndex(
      "quiz_attempts",
      new TableIndex({
        name: "IDX_quiz_attempts_quizId_createdAt",
        columnNames: ["quizId", "createdAt"],
      }),
    );

    // Создание таблицы attempt_answers
    await queryRunner.createTable(
      new Table({
        name: "attempt_answers",
        schema: "spell_quiz",
        columns: [
          {
            name: "id",
            type: "serial",
            isPrimary: true,
          },
          {
            name: "givenAnswer",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "isCorrect",
            type: "boolean",
            isNullable: false,
          },
          {
            name: "diff",
            type: "jsonb",
            isNullable: true,
          },
          {
            name: "attemptId",
            type: "integer",
            isNullable: false,
          },
          {
            name: "questionId",
            type: "integer",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Добавление внешних ключей для attempt_answers
    await queryRunner.createForeignKey(
      "attempt_answers",
      new TableForeignKey({
        columnNames: ["attemptId"],
        referencedColumnNames: ["id"],
        referencedTableName: "quiz_attempts",
        referencedSchema: "spell_quiz",
        onDelete: "CASCADE",
        name: "FK_attempt_answers_attemptId",
      }),
    );

    await queryRunner.createForeignKey(
      "attempt_answers",
      new TableForeignKey({
        columnNames: ["questionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "questions",
        referencedSchema: "spell_quiz",
        onDelete: "CASCADE",
        name: "FK_attempt_answers_questionId",
      }),
    );

    // Добавление индекса для attempt_answers
    await queryRunner.createIndex(
      "attempt_answers",
      new TableIndex({
        name: "IDX_attempt_answers_attemptId_questionId",
        columnNames: ["attemptId", "questionId"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление таблиц в обратном порядке
    await queryRunner.dropTable("attempt_answers", true);
    await queryRunner.dropTable("quiz_attempts", true);
    await queryRunner.dropTable("questions", true);
    await queryRunner.dropTable("quizzes", true);
  }
}
