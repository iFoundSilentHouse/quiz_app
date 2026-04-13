import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from "uuid";
import { extname } from "path";
import { UploadService } from "./upload.service.js";

// Конфигурация локального хранилища
const storage = diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    const filename = `${uuidv4()}${ext}`; // генерируем уникальное имя
    cb(null, filename);
  },
});

// Фильтр типов файлов (только изображения)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    cb(null, true);
  } else {
    cb(new BadRequestException("Only image files are allowed!"), false);
  }
};

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file", { storage, fileFilter }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is not provided");
    }

    return this.uploadService.processLocalUpload(file.filename);
  }
}
