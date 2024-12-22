import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbProvider } from './provider/database/mongodb.provider';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './shared/exception/http_exception.filter';
import { LoggerMiddleware } from './shared/exception/middleware/logger.middleware';
import { AlbumModule } from './module/album/album.module';
import { JwtModule } from '@nestjs/jwt';
import { CustomLoggerModule } from './module/custom_logger/custom_logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    JwtModule.register({ global: true }),
    AlbumModule,
    CustomLoggerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  static port: number;
  constructor(
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
