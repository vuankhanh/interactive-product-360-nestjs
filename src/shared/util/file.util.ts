import * as fs from 'fs';

export class FileUtil {
  static async read(filePath: string, encoding: BufferEncoding = 'utf8'): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  static write(filePath: string, data: string | NodeJS.ArrayBufferView): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(filePath);
        }
      });
    });
  }

  static remove(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async removeFolder(folderPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.rm(folderPath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static ensureDir(dirPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(dirPath);
        }
      });
    });
  }
}
