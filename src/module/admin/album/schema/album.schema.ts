import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Media } from "./media.schema";
import { IAlbum } from "src/shared/interface/media.interface";

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album implements IAlbum {
  @Prop({
    type: String,
    required: true,
    unique: true
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true
  })
  route: string;

  @Prop({
    type: Array<Media>
  })
  media: Array<Media>;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;

  constructor(album: IAlbum) {
    this.name = album.name;
    this.route = album.route;
    this.media = album.media;
    this.relativePath = album.relativePath;
  }
}

export const albumSchema = SchemaFactory.createForClass(Album);