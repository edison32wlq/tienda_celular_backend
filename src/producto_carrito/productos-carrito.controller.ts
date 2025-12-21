import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ProductosCarritoService } from './productos-carrito.service';
import { CreateProductoCarritoDto } from './dto/create-productoCarrito.dto';
import { UpdateProductoCarritoDto } from './dto/update-productoCarrito.dto';
import { ProductoCarrito } from './productoCarrito.entity';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('productosCarrito')
export class ProductosCarritoController {
  constructor(private readonly productosCarritoService: ProductosCarritoService) {}

  @Post()
  async create(@Body() dto: CreateProductoCarritoDto) {
    const created = await this.productosCarritoService.create(dto);
    if (!created) throw new InternalServerErrorException('Failed to create producto_carrito');
    return new SuccessResponseDto('ProductoCarrito created successfully', created);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<ProductoCarrito>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.productosCarritoService.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve productos_carrito');

    return new SuccessResponseDto('ProductosCarrito retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.productosCarritoService.findOne(id);
    if (!entity) throw new NotFoundException('ProductoCarrito not found');
    return new SuccessResponseDto('ProductoCarrito retrieved successfully', entity);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductoCarritoDto) {
    const updated = await this.productosCarritoService.update(id, dto);
    if (!updated) throw new NotFoundException('ProductoCarrito not found');
    return new SuccessResponseDto('ProductoCarrito updated successfully', updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removed = await this.productosCarritoService.remove(id);
    if (!removed) throw new NotFoundException('ProductoCarrito not found');
    return new SuccessResponseDto('ProductoCarrito deleted successfully', removed);
  }
}
