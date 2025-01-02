import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from './schema/album.schema';
import { ValidateCreateAlbumGuard } from './guard/validate_create_album.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { ChangeUploadfilesNamePipe } from 'src/shared/pipe/change-uploadfile-name.pipe';
import { FilesProcessPipe } from 'src/shared/pipe/file_process.pipe';
import { DiskStoragePipe } from 'src/shared/pipe/disk-storage.pipe';
import { MediaProcessUtil } from 'src/shared/util/media_process.util';
import { HttpModule } from '@nestjs/axios';
import { CallExternalService } from 'src/shared/service/call-external.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: albumSchema,
        collection: Album.name.toLowerCase()
      }
    ]),
    HttpModule
  ],
  controllers: [AlbumController],
  providers: [
    AlbumService,
    ValidateCreateAlbumGuard,
    ConfigService,
    AuthGuard,

    ChangeUploadfilesNamePipe,
    FilesProcessPipe,
    DiskStoragePipe,

    MediaProcessUtil,
    CallExternalService
  ],
  exports: [AlbumService]
})
export class AlbumModule {}
