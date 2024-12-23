import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    AlbumModule,
    AuthModule,
    ProductModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: 'album',
            module: AlbumModule,
          }, {
            path: 'auth',
            module: AuthModule,
          }, {
            path: 'product',
            module: ProductModule,
          }
        ]
      }
    ])
  ],
})
export class AdminModule { }
