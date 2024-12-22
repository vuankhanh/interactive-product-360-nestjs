import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from 'multer';

import { IFileType } from "src/shared/interface/files.interface";
import { Request } from "express";
import { CustomBadRequestException } from "src/shared/exception/custom-exception";

const fileFilter = (req: Request, file: Express.Multer.File, cb) => {
  const matchMediaFile = ['image/png', 'image/jpeg', 'video/mp4', 'video/quicktime', 'video/webm'];

  if (matchMediaFile.indexOf(file.mimetype) === -1) {
    return cb(new CustomBadRequestException('Kiểu tệp không hợp lệ'), false);
  }
  return cb(null, true);
}

export const memoryStorageMulterOptions: MulterOptions = {
  storage: multer.memoryStorage(),
  fileFilter
}

const imageEnums = ['webp', 'jpeg', 'png'] as const;
const videoEnums = ['mp4', 'quicktime', 'webm'] as const;

export const imageTypes: { [key in typeof imageEnums[number]]: IFileType } = {
  webp: {
    type: 'image/webp',
    extension: 'webp'
  },
  jpeg: {
    type: 'image/jpeg',
    extension: 'jpeg'
  },
  png: {
    type: 'image/png',
    extension: 'png'
  },
};

export const videoTypes: { [key in typeof videoEnums[number]]: IFileType } = {
  mp4: {
    type: 'video/mp4',
    extension: 'mp4'
  },
  quicktime: {
    type: 'video/quicktime',
    extension: 'mov'
  },
  webm: {
    type: 'video/webm',
    extension: 'webm'
  }
};