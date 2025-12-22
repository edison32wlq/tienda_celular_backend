import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalleOrdenCompra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalleOrdenCompra.dto';
import { DetalleOrdenCompra } from './detalleOrdenCompra.entity';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('detalleOrdenCompra')
export class DetalleOrdenCompraController {
  constructor(private readonly detalleOrdenCompraService: DetalleOrdenCompraService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateDetalleOrdenCompraDto) {
    const detalle = await this.detalleOrdenCompraService.create(dto);
    if (!detalle) throw new InternalServerErrorException('Failed to create detalle_orden_compra');
    return new SuccessResponseDto('DetalleOrdenCompra created successfully', detalle);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<DetalleOrdenCompra>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.detalleOrdenCompraService.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve detalle_orden_compra');

    return new SuccessResponseDto('DetalleOrdenCompra retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const detalle = await this.detalleOrdenCompraService.findOne(id);
    if (!detalle) throw new NotFoundException('DetalleOrdenCompra not found');
    return new SuccessResponseDto('DetalleOrdenCompra retrieved successfully', detalle);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDetalleOrdenCompraDto) {
    const detalle = await this.detalleOrdenCompraService.update(id, dto);
    if (!detalle) throw new NotFoundException('DetalleOrdenCompra not found');
    return new SuccessResponseDto('DetalleOrdenCompra updated successfully', detalle);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const detalle = await this.detalleOrdenCompraService.remove(id);
    if (!detalle) throw new NotFoundException('DetalleOrdenCompra not found');
    return new SuccessResponseDto('DetalleOrdenCompra deleted successfully', detalle);
  }
}
