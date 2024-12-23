import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/shared/interceptor/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse_objectId_array.pipe';
import { ObjectId } from 'mongodb';
import { AuthGuard } from 'src/shared/guard/auth.guard';
import { ProductService } from './product.service';

//1. Guards: Được sử dụng để bảo vệ các route.
//2. Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller('present')
@UseInterceptors(FormatResponseInterceptor)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async getAll(
    @Query('name') name: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number
  ) {
    const filterQuery = {};
    if (name) filterQuery['name'] = { $regex: name, $options: 'i' };

    return await this.productService.getAll(filterQuery, page, size);
  }

  @Get('detail')
  async getDetail(
    @Query('route') route: string
  ) {
    const filterQuery = { name: route };
    
    return await this.productService.getDetail(filterQuery);
  }

}
