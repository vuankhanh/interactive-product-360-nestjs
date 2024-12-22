import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongodbProvider implements MongooseOptionsFactory {
  constructor(
    private configService: ConfigService
  ) { }

  createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
    const host = this.configService.get<number>('db.host');
    const port = this.configService.get<number>('db.port');
    const name = this.configService.get<string>('db.name');
    const uri = `mongodb://${host}:${port}/${name}`;
    return {
      uri,
    };
  }
}
