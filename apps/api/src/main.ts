import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors({
    // TODO: изменить захардкоженное next приложение
    origin: [`http://localhost:${process.env.FRONTEND_PORT}`, `http://127.0.0.1:${process.env.FRONTEND_PORT}`],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  });
  await app.listen(process.env.PORT ?? 3011);
}
bootstrap();
