import { Injectable } from "@nestjs/common";
import * as path from 'path';
import { imageTypes } from "src/constant/file.constanst";
import { TProcessedMedia } from "../interface/files.interface";
import { CallExternalService } from "../service/call-external.service";

@Injectable()
export class MediaProcessUtil {
  constructor(
    private readonly callExternalService: CallExternalService
  ) { }
  async processImage(file: Express.Multer.File): Promise<TProcessedMedia> {
    let newFileBuffer: Buffer<ArrayBufferLike> = await this.callExternalService.callConverterService(file.buffer, 'resize');

    const newFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name, imageTypes.webp.extension].join('.'),
      buffer: newFileBuffer,
      mimetype: imageTypes.webp.type,
    };

    let newThumbnailFileBuffer: Buffer<ArrayBufferLike> = await this.callExternalService.callConverterService(file.buffer, 'thumbnail');

    const newThumbnailFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name + '-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: newThumbnailFileBuffer,
      mimetype: imageTypes.webp.type,
    };

    const processedMedia: TProcessedMedia = {
      file: newFile,
      thumbnail: newThumbnailFile
    };

    return processedMedia;
  }
}