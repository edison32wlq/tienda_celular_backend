import {
  Controller, Get, Post as HttpPost, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { DetalleFacturaService } from './detalle_factura.service';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { DetalleFactura } from './detalle_factura.entity';

@Controller('detalle-factura')
export class DetalleFacturaController {
  constructor(private readonly detalleFacturaService: DetalleFacturaService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  create(@Body() dto: CreateDetalleFacturaDto) {
    return this.detalleFacturaService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<DetalleFactura>> {
    limit = limit > 100 ? 100 : limit;
    return this.detalleFacturaService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleFacturaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDetalleFacturaDto) {
    return this.detalleFacturaService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleFacturaService.remove(id);
  }
}
