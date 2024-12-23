import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto, UpdateProductDto } from './dto/product.dto';
import { Product } from './schema/product.schema';
import { FormatResponseInterceptor } from 'src/shared/interceptor/format_response.interceptor';
import { ParseObjectIdPipe } from 'src/shared/pipe/parse_objectId_array.pipe';
import { ObjectId } from 'mongodb';
import { AuthGuard } from 'src/shared/guard/auth.guard';

//1. Guards: Được sử dụng để bảo vệ các route.
//2. Interceptors: Được sử dụng để thay đổi hoặc mở rộng hành vi của các method.
//3. Pipes: Được sử dụng để biến đổi hoặc xác thực dữ liệu.
@Controller()
@UseGuards(AuthGuard)
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

  @Get(':id')
  async getDetail(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ) {
    const filterQuery = { _id: id };
    
    return await this.productService.getDetail(filterQuery);
  }

  @Post()
  async create(
    @Body() productDto: ProductDto
  ) {
    const product = new Product(productDto);
    product.updateAlbumId = productDto.albumId;

    return await this.productService.create(product);
  }

  @Put(':id')
  async replace(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: ProductDto
  ) {
    const filterQuery = { _id: id };
    const product = new Product(productDto);
    product.updateAlbumId = productDto.albumId;

    return await this.productService.replace(filterQuery, product);
  }

  @Patch(':id')
  async modify(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body() productDto: UpdateProductDto
  ) {
    const filterQuery = { _id: id };
    const data: Partial<Product> = productDto;
    if (productDto.albumId) data.albumId = ObjectId.createFromHexString(productDto.albumId);
    
    return await this.productService.modify(filterQuery, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseObjectIdPipe()) id: string
  ) {
    const filterQuery = { _id: id };
    return await this.productService.remove(filterQuery);
  }
}
