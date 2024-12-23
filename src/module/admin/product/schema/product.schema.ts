import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Album } from 'src/module/admin/album/schema/album.schema';
import { ObjectId } from 'mongodb';
import { IProduct, TSize } from 'src/shared/interface/product.interface';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product implements IProduct {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Boolean, required: true })
  availability: boolean;
  
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Object, required: true })
  size?: TSize;

  @Prop({ type: Types.ObjectId, required: true, ref: Album.name })
  albumId: Types.ObjectId | string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  usageInstructions: string;

  constructor(product: IProduct) {
    this.name = product.name;
    this.price = product.price;
    this.availability = product.availability;
    this.category = product.category;
    this.size = product.size;
    this.description = product.description;
    this.usageInstructions = product.usageInstructions;
  }

  set updateAlbumId(albumId: string) {
    this.albumId = ObjectId.createFromHexString(albumId);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);