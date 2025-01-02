import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guard/validate_create_album.guard';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptor/files_procced.interceptor';
import { Album } from './schema/album.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptor/format_response.interceptor';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { ValidateModifyAlbumGuard } from './guard/validate_modify_album.guard';
import { Request } from 'express';
import { AlbumModifyItemIndexChangeDto, AlbumModifyRemoveFilesDto } from './dto/album_modify.dto';
import { ParseObjectIdArrayPipe, ParseObjectIdPipe } from 'src/shared/pipe/parse_objectId_array.pipe';
import { FilesProcessPipe } from 'src/shared/pipe/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/pipe/disk-storage.pipe';
import { ChangeUploadfilesNamePipe } from 'src/shared/pipe/change-uploadfile-name.pipe';
import { IAlbum, IMedia } from 'src/shared/interface/media.interface';
import { memoryStorageMulterOptions } from 'src/constant/file.constanst';
import { CallExternalService } from 'src/shared/service/call-external.service';
import { ConfigService } from '@nestjs/config';
import { ObjectProcessUtil } from 'src/shared/util/object-process.util';
import { CustomInternalServerErrorException } from 'src/shared/exception/custom-exception';

@Controller()
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class AlbumController {
  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService,
    private readonly callExternalService: CallExternalService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };
    const metaData = await this.albumService.getAll(filterQuery, page, size);

    return metaData;
  }

  @Get('detail')
  async getDetail(
    @Query('id', new ParseObjectIdPipe()) id?: string,
    @Query('route') route?: string
  ) {
    const filterQuery = {};
    if (id) filterQuery['_id'] = id;
    else if (route) filterQuery['route'] = route;
    
    return await this.albumService.getDetail(filterQuery);
  }

  @Post()
  @UseGuards(ValidateCreateAlbumGuard, AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async create(
    @Req() req: Request,
    @Query('name') name: string,
    @Query('route') route: string,
    @Body() body: AlbumDto,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const relativePath = req['customParams'].relativePath + '/' + route;

    const album: IAlbum = {
      name,
      route,
      media: medias,
      relativePath
    }
    const albumDoc: Album = new Album(album);
    const createdAlbum = await this.albumService.create(albumDoc);
    return createdAlbum;
  }

  @Post('get-gif/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)

  async getGif(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const queryFilter = { _id: id };

    try {
      const album = await this.albumService.getDetail(queryFilter);
      //
      const albumFolder = this.configService.get<string>('folder.album');
      
      const urls = ObjectProcessUtil.albumDataToListUrl(albumFolder, album);
      const buffers = await ObjectProcessUtil.urlsToBuffers(urls);
  
      const gifBuffer = await this.callExternalService.callGetGifService(buffers);
      return gifBuffer;
    } catch (error) {
      throw new CustomInternalServerErrorException(error.message || error);
    }
  }

  @Patch('add-new-files')
  @UseGuards(ValidateModifyAlbumGuard, AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async addNewFiles(
    @Query('route') route: string,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    console.log('route', route);
    
    const queryFilter = { route };
    const updatedAlbums = await this.albumService.addNewFiles(queryFilter, medias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  @UseGuards(AuthGuard)
  async removeFiles(
    @Query('route') route: string,
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: AlbumModifyRemoveFilesDto,
  ) {
    const queryFilter = { route };
    const updatedAlbums = await this.albumService.removeFiles(queryFilter, body.filesWillRemove);
    return updatedAlbums;
  }

  @Patch('item-index-change')
  @UseGuards(AuthGuard)
  async itemIndexChange(
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('newItemIndexChange')) body: AlbumModifyItemIndexChangeDto,
  ) {
    const updatedAlbums = await this.albumService.itemIndexChange({}, body.newItemIndexChange);
    return updatedAlbums;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const queryFilter = { _id: id };
    return await this.albumService.remove(queryFilter);
  }

}
