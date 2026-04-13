import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadService {
  async processLocalUpload(filename: string): Promise<{ imageUrl: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3011";

    return {
      imageUrl: `${baseUrl}/uploads/${filename}`,
    };
  }
}
