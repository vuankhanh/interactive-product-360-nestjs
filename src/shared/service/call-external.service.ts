import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CallExternalService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) { }

  async callConverterService(buffer: Buffer, action: string): Promise<Buffer> {
    const converterServiceUrl = this.configService.get<string>('converterService.url');
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    formData.append('image', blob);
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${converterServiceUrl}/${action}`, formData, {
          responseType: 'arraybuffer',
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(error.message || error);
    }
  }

  async callGetGifService(files: {
    buffer: Buffer<ArrayBufferLike>,
    originalname: string
  }[]): Promise<Buffer> {
    const converterServiceUrl = this.configService.get<string>('converterService.url');
    const formData = new FormData();

    for(let file of files){
      const blob = new Blob([file.buffer], { type: 'application/octet-stream' });
      formData.append('images', blob, file.originalname);
    }

    try {
      const response = await lastValueFrom(
        this.httpService.post(`${converterServiceUrl}/animated-gif`, formData, {
          responseType: 'arraybuffer',
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      return Buffer.from(response.data);
    } catch (error) {
      throw new Error(error.message || error);
    }
  }
}
