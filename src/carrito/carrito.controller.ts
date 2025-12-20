import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Carrito } from './carrito.entity';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('carrito')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  @Post()
  async create(@Body() dto: CreateCarritoDto) {
    const carrito = await this.carritoService.create(dto);
    if (!carrito) throw new InternalServerErrorException('Failed to create carrito');
    return new SuccessResponseDto('Carrito created successfully', carrito);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<Carrito>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.carritoService.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve carrito');
    return new SuccessResponseDto('Carrito retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const carrito = await this.carritoService.findOne(id);
    if (!carrito) throw new NotFoundException('Carrito not found');
    return new SuccessResponseDto('Carrito retrieved successfully', carrito);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCarritoDto) {
    const carrito = await this.carritoService.update(id, dto);
    if (!carrito) throw new NotFoundException('Carrito not found');
    return new SuccessResponseDto('Carrito updated successfully', carrito);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const carrito = await this.carritoService.remove(id);
    if (!carrito) throw new NotFoundException('Carrito not found');
    return new SuccessResponseDto('Carrito deleted successfully', carrito);
  }
}
