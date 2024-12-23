import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { Product, ProductDocument } from './schema/product.schema';
import { Document, Types, FilterQuery, FlattenMaps, Model, HydratedDocument } from 'mongoose';
import { IPaging } from 'src/shared/interface/paging.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from '../album/schema/album.schema';

@Injectable()
export class ProductService implements IBasicService<Product> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async create(data: Product): Promise<ProductDocument> {
    const product = new this.productModel(data);
    await product.save();
    return product;
  }
  
  async getAll(filterQuery: FilterQuery<Product>, page: number, size: number): Promise<{ data: FlattenMaps<Product>[]; paging: IPaging; }> {
    const countTotal = await this.productModel.countDocuments(filterQuery);
    const productAggregate = await this.productModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Album.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'albumId',
            foreignField: '_id',
            as: 'albumDetail'
          }
        },
        {
          $unwind: {
            path: '$albumDetail',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            'albumDetail.mediaItems': { $size: { $ifNull: ['$albumDetail.media', []] } },
            'albumDetail.thumbnail': { $arrayElemAt: ["$albumDetail.media.thumbnailUrl", 0] }
          }
        },
        {
          $project: {
            'albumDetail.media': 0,
            'description': 0,
            'usageInstructions': 0,
            'brand': 0,
            'rating': 0,
            'reviews': 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: productAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.tranformToDetaiData(filterQuery);
  }

  async replace(filterQuery: FilterQuery<Product>, data: Product): Promise<ProductDocument> {
    await this.productModel.findOneAndReplace(filterQuery, data);
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async modify(filterQuery: FilterQuery<Product>, data: Partial<Product>): Promise<ProductDocument> {
    await this.productModel.findOneAndUpdate(filterQuery, data, { new: true });
    const product = await this.tranformToDetaiData(filterQuery);
    return product;
  }

  async remove(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.productModel.findOneAndDelete(filterQuery);
  }

  private async tranformToDetaiData(filterQuery: FilterQuery<Product>): Promise<ProductDocument> {
    return await this.productModel.aggregate(
      [
        { $match: filterQuery },
        {
          $lookup: {
            from: Album.name.toLocaleLowerCase(), // Tên của bộ sưu tập Album
            localField: 'albumId',
            foreignField: '_id',
            as: 'albumDetail'
          }
        },
        {
          $unwind: {
            path: '$albumDetail',
            preserveNullAndEmptyArrays: true // Giữ lại tài liệu gốc nếu không có tài liệu nào khớp
          }
        },
        {
          $addFields: {
            'albumDetail.mediaItems': { $size: { $ifNull: ['$albumDetail.media', []] } },
            'albumDetail.thumbnail': { $arrayElemAt: ["$albumDetail.media.thumbnailUrl", 0] }
          }
        },
      ]
    ).then((data) => data[0]);
  }

}
