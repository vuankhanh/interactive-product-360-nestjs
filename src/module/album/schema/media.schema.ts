import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IMedia } from "src/shared/interface/media.interface";

const enumType = ['image', 'video'];

export type MediaDocument = HydratedDocument<Media>;

@Schema({
  timestamps: true
})
export class Media implements IMedia {
  @Prop({
    type: String,
    required: true,
  })
  url: string;

  @Prop({
    type: String,
    required: true
  })
  thumbnailUrl: string;

  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: String
  })
  description: string;

  @Prop({
    type: String
  })
  alternateName: string;

  @Prop({
    type: String,
    enum: enumType,
    required: true
  })
  type: 'image' | 'video';
}