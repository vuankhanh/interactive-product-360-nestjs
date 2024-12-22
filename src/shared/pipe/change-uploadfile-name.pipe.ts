import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ChangeUploadfileNamePipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    return {
      ...file,
      originalname: `${Date.now()}-${file.originalname}`
    };
  }
}

@Injectable()
export class ChangeUploadfilesNamePipe implements PipeTransform {
  transform(files: Array<Express.Multer.File>) {
    return files.map(file => {
      return {
        ...file,
        originalname: `${Date.now()}-${file.originalname}`
      }
    });
  }
}