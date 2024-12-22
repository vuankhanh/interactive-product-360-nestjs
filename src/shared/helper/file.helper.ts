import { FileUtil } from "../util/file.util";

export class FileHelper {
  static async removeMediaFiles(rootPath: string, mediaUrls: Array<{ url: string, thumbnailUrl: string }>) {
    try {
      for (let i = 0; i < mediaUrls.length; i++) {
        const mediaUrl = mediaUrls[i];
        const url = rootPath + '/' + mediaUrl.url;
        const thumbnailUrl = rootPath +'/' +mediaUrl.thumbnailUrl;
        await FileUtil.remove(url);
        await FileUtil.remove(thumbnailUrl);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  static async removeFolder(folderPath: string, mediaFolder: string) {
    await FileUtil.removeFolder(folderPath + '/' + mediaFolder);
  }
}
