import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe.js";
import { mkdir } from "fs/promises";
import { join } from "path";

const origins = ["http://localhost:3010", "http://127.0.0.1:3010"];

if (process.env.FRONTEND_URL) {
  origins.push(process.env.FRONTEND_URL);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadPath = join(process.cwd(), "uploads");
  await mkdir(uploadPath, { recursive: true }); // Создаст папку, если её нет
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: origins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });
  await app.listen(process.env.PORT ?? 3011);
}
bootstrap();
