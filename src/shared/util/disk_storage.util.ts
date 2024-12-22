import { Injectable } from "@nestjs/common";
import * as path from 'path';
import { FileUtil } from "./file.util";

@Injectable()
export class DiskStorageUtil {
  static async saveToDisk(rootPath: string, file: Express.Multer.File): Promise<string> {
    await FileUtil.ensureDir(rootPath);
    
    const filePath = path.join(rootPath, file.originalname);
    await FileUtil.write(filePath, file.buffer);

    return filePath;
  }
}