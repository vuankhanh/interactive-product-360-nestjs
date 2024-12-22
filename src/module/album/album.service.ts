import { Injectable } from '@nestjs/common';
import { Album, AlbumDocument } from './schema/album.schema';
import mongoose, { FilterQuery, HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IBasicService } from 'src/shared/interface/basic_service.interface';
import { IMedia } from 'src/shared/interface/media.interface';
import { SortUtil } from 'src/shared/util/sort_util';
import { FileHelper } from 'src/shared/helper/file.helper';
import { ConfigService } from '@nestjs/config';
import { Media, MediaDocument } from './schema/media.schema';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  private albumFoler: string;
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private configService: ConfigService
  ) {
    this.albumFoler = this.configService.get('folder.album');
  }

  async checkExistAlbum(filterQuery: FilterQuery<Album>) {
    return await this.albumModel.countDocuments(filterQuery);
  }

  async create(data: Album) {
    data.media = data.media.map(file => {
      return { ...file, _id: new Types.ObjectId() }
    });
    const newAlbum = new this.albumModel(data);
    await newAlbum.save();
    const filterQuery = { _id: newAlbum._id };
    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async getAll(filterQuery: FilterQuery<Album>, page: number, size: number) {
    const countTotal = await this.albumModel.countDocuments(filterQuery);
    const albumsAggregate = await this.albumModel.aggregate(
      [
        { $match: filterQuery },
        {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } },
            thumbnail: { $arrayElemAt: ["$media.thumbnailUrl", 0] }
          }
        }, {
          $project: {
            media: 0
          }
        },
        { $skip: size * (page - 1) },
        { $limit: size },
      ]
    );

    const metaData = {
      data: albumsAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(filterQuery: FilterQuery<Album>) {
    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async replace(filterQuery: FilterQuery<Album>, data: Album) {
    const milestone = await this.albumModel.findOneAndUpdate(filterQuery, data, { new: true });
    return milestone;
  }

  async addNewFiles(
    filterQuery: FilterQuery<Album>,
    newFiles: Array<IMedia> = []
  ) {
    if (!newFiles.length) {
      throw new Error('No new files to add');
    }

    newFiles = newFiles.map(file => {
      return { ...file, _id: new Types.ObjectId() }
    })
    const updateQuery = {
      $push: {
        media: { $each: newFiles }
      }
    };

    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async removeFiles(
    filterQuery: FilterQuery<Album>,
    filesWillRemove: Array<mongoose.Types.ObjectId> = [],
  ) {
    if (!filesWillRemove.length) {
      throw new Error('No files to remove');
    }

    const updateQuery = {
      $pull: {
        media: { _id: { $in: filesWillRemove } }
      }
    }

    //Lọc ra danh sách file cục bộ cần xóa
    await this.filterMediaItems(filterQuery._id, filesWillRemove).then(async mediaUrls => {
      //Xóa file
      await FileHelper.removeMediaFiles(this.albumFoler, mediaUrls);
    });

    await this.albumModel.findOneAndUpdate(filterQuery, updateQuery, { safe: true, new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async itemIndexChange(filterQuery: FilterQuery<Album>, itemIndexChanges: Array<string | mongoose.Types.ObjectId>) {
    const album = await this.albumModel.findOne(filterQuery);
    if (!album) {
      throw new Error('Album not found');
    }

    album.media = SortUtil.sortDocumentArrayByIndex<Media>(album.media as Array<MediaDocument>, itemIndexChanges);

    await album.save();

    const updatedAlbum = await this.tranformToDetaiData(filterQuery);
    return updatedAlbum;
  }

  async modify(filterQuery: FilterQuery<Album>, data: Partial<Album>) {
    await this.albumModel.findOneAndUpdate(filterQuery, data, { new: true });

    const album = await this.tranformToDetaiData(filterQuery);
    return album;
  }

  async remove(filterQuery: FilterQuery<Album>) {
    const album = await this.albumModel.findOneAndDelete(filterQuery);
    if (album?.relativePath) {
      await FileHelper.removeFolder(this.albumFoler, album.relativePath);
    }
    
    return album;
  }

  private async tranformToDetaiData($match: FilterQuery<Album>): Promise<AlbumDocument> {
    return await this.albumModel.aggregate(
      [
        { $match }, {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } },
            thumbnail: { $arrayElemAt: ["$media.thumbnailUrl", 0] }
          }
        }, {
          $replaceWith: {
            $setField: {
              field: "media",
              input: "$$ROOT",
              value: {
                $sortArray: { input: "$media", sortBy: { type: 1 } }
              }
            }
          }
        }, {
          $limit: 1
        }
      ]
    ).then(res => {
      return res[0]
    });
  }

  async filterMediaItems(_id: mongoose.Types.ObjectId | string, itemIds: Array<mongoose.Types.ObjectId | string>): Promise<Array<{ url: string, thumbnailUrl: string }>> {
    return this.albumModel.aggregate([
      { $match: { _id: new Types.ObjectId(_id) } },
      {
        $project: {
          media: {
            $filter: {
              input: '$media',
              as: 'item',
              cond: { $in: ['$$item._id', itemIds.map(id => new Types.ObjectId(id))] }
            }
          }
        }
      },
      {
        $project: {
          media: {
            $map: {
              input: '$media',
              as: 'item',
              in: { url: '$$item.url', thumbnailUrl: '$$item.thumbnailUrl' }
            }
          }
        }
      }
    ]).then(res => {
      return res[0] ? res[0].media : [];
    });
  }
}
