export interface IAlbum {
  name: string;
  route: string;
  media: IMedia[];
  relativePath: string;
}

export interface IMedia {
  url: string;
  thumbnailUrl: string;
  name: string;
  description: string;
  alternateName: string;
  type: 'image' | 'video';
}