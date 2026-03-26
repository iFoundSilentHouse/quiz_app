import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [`http://localhost:${process.env.PORT}`, `http://127.0.0.1:${process.env.PORT}`],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3011);
}
bootstrap();
