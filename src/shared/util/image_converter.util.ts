import { Injectable } from "@nestjs/common";

import * as sharp from 'sharp';

@Injectable()
export class ImageConverterUtil {
  constructor() { }

  static async resize(file: Express.Multer.File): Promise<Buffer> {
    if(!file.buffer) return Promise.reject('File buffer is empty');
    const metaData = await sharp(file.buffer).metadata();

    const newWidth = Math.round(metaData.width * 0.7);
    const newHeight = Math.round(metaData.height * 0.7);
    return await sharp(file.buffer)
    .rotate()
    .resize(newWidth, newHeight)
    .webp()
    .toBuffer();
  }

  static async thumbnail(buffer: Buffer, sizeWidth: number): Promise<Buffer> {
    return await sharp(buffer).resize({ width: sizeWidth }).withMetadata().toBuffer();
  }
}