import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TProcessedMedia } from '../interface/files.interface';
import { IMedia } from '../interface/media.interface';
import { DiskStorageUtil } from '../util/disk_storage.util';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST,
})
export class DiskStoragePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) private readonly request: Request
  ) { }
  transform(
    processedMedia: TProcessedMedia | TProcessedMedia[]
  ): IMedia | Array<IMedia> {
    return Array.isArray(processedMedia) ? processedMedia.map(media => this.saveToDisk(media)) : this.saveToDisk(processedMedia);
  }

  private saveToDisk(processedMedia: TProcessedMedia): IMedia {
    const customParams = this.request['customParams'];
    const destination = customParams.albumFolder;

    const query = this.request.query;
    const route = query.route as string;
    
    const relativePath = customParams.relativePath + '/' + route;

    const absolutePath = destination + '/' + relativePath;

    const file = processedMedia.file;
    
    DiskStorageUtil.saveToDisk(absolutePath, file);

    const thumbnail = processedMedia.thumbnail;
    DiskStorageUtil.saveToDisk(absolutePath, thumbnail);

    const media: IMedia = {
      url: relativePath + '/' + file.originalname,
      thumbnailUrl: relativePath + '/' + thumbnail.originalname,
      name: file.originalname,
      description: '',
      alternateName: '',
      type: file.mimetype.includes('image') ? 'image' : 'video',
    }

    return media;
  }
}
