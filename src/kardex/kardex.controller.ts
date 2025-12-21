import {
  Controller, Get, Post as HttpPost, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { KardexService } from './kardex.service';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { UpdateKardexDto } from './dto/update-kardex.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Kardex } from './kardex.entity';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpPost()
  create(@Body() dto: CreateKardexDto) {
    return this.kardexService.create(dto);
  }
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Kardex>> {
    limit = limit > 100 ? 100 : limit;
    return this.kardexService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kardexService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKardexDto) {
    return this.kardexService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kardexService.remove(id);
  }

  @Get('stock/:id_celular')
  stockActual(@Param('id_celular') id_celular: string) {
    return this.kardexService.stockActual(id_celular);
  }
}
