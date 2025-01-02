import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { CustomBadRequestException, CustomInternalServerErrorException } from 'src/shared/exception/custom-exception';
@Injectable()
export class ValidateModifyAlbumGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const query = request.query;
    const route = query.route;
    if(!route) {
      return false;
    }

    const filterQuery = { route };
    const album = await this.albumService.getDetail(filterQuery);
    
    if (!album) {
      throw new CustomBadRequestException('Không tìm thấy Album này');
    };

    if(!album.relativePath) {
      throw new CustomInternalServerErrorException('Album relative path not found');
    }

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'product';
    
    return true;
  }
}