import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/module/admin/product/schema/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
        collection: Product.name.toLowerCase()
      }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule { }
