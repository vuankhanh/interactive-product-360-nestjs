import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
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

@Controller()
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(ValidationPipe)
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
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

  @Patch('add-new-files')
  @UseGuards(ValidateModifyAlbumGuard, AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', null, memoryStorageMulterOptions),
    FilesProccedInterceptor
  )
  async addNewFiles(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @UploadedFiles(ChangeUploadfilesNamePipe, FilesProcessPipe, DiskStoragePipe) medias: Array<IMedia>
  ) {
    const queryFilter = { _id: id };
    const updatedAlbums = await this.albumService.addNewFiles(queryFilter, medias);
    return updatedAlbums;
  }

  @Patch('remove-files')
  @UseGuards(AuthGuard)
  async removeFiles(
    @Query('id', new ParseObjectIdPipe()) id: string,
    @Body(new ValidationPipe({ transform: true }), new ParseObjectIdArrayPipe('filesWillRemove')) body: AlbumModifyRemoveFilesDto,
  ) {
    const queryFilter = { _id: id };
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
