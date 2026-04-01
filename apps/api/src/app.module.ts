import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Quiz, Question, QuizAttempt, AttemptAnswer } from '@spell/shared';
import { QuizModule } from './modules/quiz/quiz.module.js';
import { SharedModule } from './modules/shared/shared.module.js';
import { UploadModule } from './modules/upload/upload.module.js';

@Module({
  imports: [
    // Конфигурация переменных окружения
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    
    // Основная конфигурация TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'indigo_user'),
        password: configService.get('DB_PASSWORD', 'secure_pass'),
        database: configService.get('DB_DATABASE', 'quiz_app'),
        schema: 'spell_quiz',
        
        // Регистрация entity
        entities: [
          Quiz,
          Question,
          QuizAttempt,
          AttemptAnswer,
        ],
        
        // Автоматическое создание таблиц (только для разработки!)
        synchronize: false, // ВАЖНО: false в production
        
        // Логирование
        logging: configService.get('NODE_ENV') === 'development',
        
        // Настройки пула соединений
        extra: {
          max: 20, // Максимум соединений
          idleTimeoutMillis: 30000, // Таймаут простоя
        },
      }),
      inject: [ConfigService],
    }),
    
    // Настройка раздачи статики из папки ./uploads
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    // ... TypeOrmModule,
    // ... QuizModule,
    UploadModule,

    // Импорт модулей приложения
    SharedModule,
    QuizModule,
  ],
})
export class AppModule {}
