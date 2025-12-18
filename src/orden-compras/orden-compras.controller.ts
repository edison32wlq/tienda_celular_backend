import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OrdenComprasService } from './orden-compras.service';
import { CreateOrdenCompraDto } from './dto/create-ordenCompra.dto';
import { UpdateOrdenCompraDto } from './dto/update-ordenCompra.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { OrdenCompra } from './ordenCompra.entity';

@Controller('ordenCompras')
export class OrdenComprasController {
  constructor(private readonly ordenComprasService: OrdenComprasService) {}

  @Post()
  create(@Body() createOrdenCompraDto: CreateOrdenCompraDto) {
    return this.ordenComprasService.create(createOrdenCompraDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<OrdenCompra>> {
    limit = limit > 100 ? 100 : limit;
    return this.ordenComprasService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenComprasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return this.ordenComprasService.update(id, updateOrdenCompraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenComprasService.remove(id);
  }
}
