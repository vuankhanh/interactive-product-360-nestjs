import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AlbumService } from '../album.service';
import { ConfigService } from '@nestjs/config';
import { VietnameseAccentUtil } from 'src/shared/util/vietnamese-accent.util';
import { CustomConflictException } from 'src/shared/exception/custom-exception';

@Injectable()
export class ValidateCreateAlbumGuard implements CanActivate {
  constructor(
    private readonly albumService: AlbumService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contentType = request.headers['content-type'];
    
    const checkContentType: boolean = contentType && contentType.includes('multipart/form-data');
    
    if (!checkContentType) {
      return false;
    }

    const query = request.query;
    const name = query.name;
    
    if(!name) {
      return false;
    }

    const nameNonAccentVietnamese = VietnameseAccentUtil.toNonAccentVietnamese(name);
    const route = VietnameseAccentUtil.replaceSpaceToDash(nameNonAccentVietnamese);

    const isExists = await this.albumService.checkExistAlbum({ route });
    if (isExists) {
      throw new CustomConflictException('Album đã tồn tại');
    };

    query['route'] = route;

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    
    request.customParams.albumFolder = albumFolder;
    request.customParams.relativePath = 'product';
    
    return true;
  }
}
