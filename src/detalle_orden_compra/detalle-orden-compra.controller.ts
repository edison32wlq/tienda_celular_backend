import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalleOrdenCompra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalleOrdenCompra.dto';

@Controller('detalleOrdenCompra')
export class DetalleOrdenCompraController {
  constructor(
    private readonly detalleOrdenCompraService: DetalleOrdenCompraService,
  ) {}

  @Post()
  create(@Body() dto: CreateDetalleOrdenCompraDto) {
    return this.detalleOrdenCompraService.create(dto);
  }

  @Get()
  findAll() {
    return this.detalleOrdenCompraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleOrdenCompraService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDetalleOrdenCompraDto,
  ) {
    return this.detalleOrdenCompraService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleOrdenCompraService.remove(id);
  }
}
