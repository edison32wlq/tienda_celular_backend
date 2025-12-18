import {
  Controller,
  Post as HttpPost,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { DetalleFacturaService } from './detalle_factura.service';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';

@Controller('detalle-factura')
export class DetalleFacturaController {
  constructor(private readonly detalleFacturaService: DetalleFacturaService) {}

  @HttpPost()
  create(@Body() dto: CreateDetalleFacturaDto) {
    return this.detalleFacturaService.create(dto);
  }

  @Get()
  findAll() {
    return this.detalleFacturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleFacturaService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDetalleFacturaDto) {
    return this.detalleFacturaService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleFacturaService.remove(+id);
  }
}
