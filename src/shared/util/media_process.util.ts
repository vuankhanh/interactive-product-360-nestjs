import { Injectable } from "@nestjs/common";
import * as path from 'path';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { imageTypes } from "src/constant/file.constanst";
import { TProcessedMedia } from "../interface/files.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MediaProcessUtil {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async processImage(file: Express.Multer.File): Promise<TProcessedMedia> {
    const newFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name, imageTypes.webp.extension].join('.'),
      buffer: await this.callExternalService(file.buffer, 'resize'),
      mimetype: imageTypes.webp.type,
    };
  
    const newThumbnailFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: await this.callExternalService(file.buffer, 'thumbnail'),
      mimetype: imageTypes.webp.type,
    };

    const processedMedia: TProcessedMedia = {
      file: newFile,
      thumbnail: newThumbnailFile
    };

    return processedMedia;
  }

  private async callExternalService(buffer: Buffer, action: string): Promise<Buffer> {
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
}