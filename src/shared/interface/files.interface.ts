export interface IFileType {
  type: string;
  extension: string;
}

export type TProcessedMedia = {
  file: Express.Multer.File;
  thumbnail: Express.Multer.File;
}