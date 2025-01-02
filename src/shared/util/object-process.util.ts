import { Injectable } from "@nestjs/common";
import { Album } from "src/module/admin/album/schema/album.schema";
import { FileUtil } from "./file.util";
import * as path from 'path';

@Injectable()
export class ObjectProcessUtil {
  static albumDataToListUrl(rootUrl: string, albumData: Album): string[]{
    return albumData.media.map(media => `${rootUrl}/${media.url}`);
  }

  static async urlsToBuffers(urls: string[]): Promise<{
    buffer: Buffer<ArrayBufferLike>,
    originalname: string
  }[]>{
    const buffers: {
      buffer: Buffer<ArrayBufferLike>,
      originalname: string
    }[] = [];
    
    for(let url of urls){
      const buffer = await FileUtil.read(url);
      const originalname = path.basename(url); // Lấy tên file từ URL
      buffers.push({ buffer, originalname });
    }
    return buffers;
  }
}
