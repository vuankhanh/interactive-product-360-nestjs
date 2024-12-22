import { Injectable } from "@nestjs/common";
import { ImageConverterUtil } from "./image_converter.util";
import { VideoConverterUtil } from "./video_converter.util";
import * as path from 'path';
import { imageTypes } from "src/constant/file.constanst";
import { TProcessedMedia } from "../interface/files.interface";

@Injectable()
export class MediaProcessUtil {
  static async processImage(file: Express.Multer.File): Promise<TProcessedMedia> {
    const bufferFile = await ImageConverterUtil.resize(file);
    const newFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name, imageTypes.webp.extension].join('.'),
      buffer: bufferFile,
      mimetype: imageTypes.webp.type,
    };
  
    const newThumbnailFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: await ImageConverterUtil.thumbnail(bufferFile, 250),
      mimetype: imageTypes.webp.type,
    };

    const processedMedia: TProcessedMedia = {
      file: newFile,
      thumbnail: newThumbnailFile
    };

    return processedMedia;
  }
  
  static async originalVideo(file: Express.Multer.File): Promise<TProcessedMedia> {
    const newThumbnailFile: Express.Multer.File = {
      ...file,
      originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: await VideoConverterUtil.generateThumbnail(file.buffer),
      mimetype: imageTypes.webp.type,
    };
  
    const processedMedia: TProcessedMedia = {
      file,
      thumbnail: newThumbnailFile
    }
    return processedMedia
  }
  
  // Uncomment if you want to convert video to webm
  // static async processVideo(file: Express.Multer.File): Promise<TProcessedMedia> {
  //   const bufferFile = await VideoConverterUtil.convert(file);
  //   const newFile: Express.Multer.File = {
  //     ...file,
  //     originalname: [path.parse(file.originalname).name, videoTypes.webm.extension].join('.'),
  //     buffer: bufferFile,
  //     mimetype: videoTypes.webm.type,
  //   };
    
  //   const newThumbnailFile: Express.Multer.File = {
  //     ...file,
  //     originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
  //     buffer: await VideoConverterUtil.generateThumbnail(bufferFile),
  //     mimetype: imageTypes.webp.type,
  //   };
  
  //   const processedMedia: TProcessedMedia = {
  //     file: newFile,
  //     thumbnail: newThumbnailFile
  //   }
  //   return processedMedia
  // }
}