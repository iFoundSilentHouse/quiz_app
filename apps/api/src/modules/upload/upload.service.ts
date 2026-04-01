import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async processLocalUpload(filename: string): Promise<{ imageUrl: string }> {
    // TODO: В идеале порт брать из ConfigService, но для простоты захардкодим текущий
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';
    
    return {
      imageUrl: `${baseUrl}/uploads/${filename}`,
    };
  }
}