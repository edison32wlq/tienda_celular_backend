import {
  Controller, Get, Post as HttpPost, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './factura.entity';

@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.create(createFacturaDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Factura>> {
    limit = limit > 100 ? 100 : limit;
    return this.facturaService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturaService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFacturaDto: UpdateFacturaDto) {
    return this.facturaService.update(id, updateFacturaDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturaService.remove(id);
  }
}
