import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';

import { REQUEST } from '@nestjs/core';
import { TProcessedMedia } from '../interface/files.interface';
import { MediaProcessUtil } from '../util/media_process.util';
import { CustomInternalServerErrorException } from '../exception/custom-exception';

@Injectable({
  scope: Scope.REQUEST,
})
export class FileProcessPipe implements PipeTransform {
  constructor() {}
  async transform(file: Express.Multer.File): Promise<TProcessedMedia> {
    try {
      return file.mimetype.includes('image') ? await MediaProcessUtil.processImage(file) : await MediaProcessUtil.originalVideo(file);
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message || error);
    }
  }
}

@Injectable()
export class FilesProcessPipe implements PipeTransform {
  constructor() {}
  async transform(files: Express.Multer.File[]): Promise<Array<TProcessedMedia>> {
    try {
      return await Promise.all(
        files.map(async file=>{
          return file.mimetype.includes('image') ? await MediaProcessUtil.processImage(file) : await MediaProcessUtil.originalVideo(file);
        })
      )
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message || error);
    }
  }
}