import { Injectable } from "@nestjs/common";
import { Album } from "src/module/admin/album/schema/album.schema";
import { FileUtil } from "./file.util";

@Injectable()
export class ObjectProcessUtil {
  static albumDataToListUrl(rootUrl: string, albumData: Album): string[]{
    return albumData.media.map(media => `${rootUrl}/${media.url}`);
  }

  static async urlsToBuffers(urls: string[]): Promise<Buffer<ArrayBufferLike>[]>{
    const buffers: Buffer<ArrayBufferLike>[] = [];
    for(let url of urls){
      buffers.push(await FileUtil.read(url));
    }
    return buffers;
  }
}
