import {
  Controller,
  Post as HttpPost,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';

import { KardexService } from './kardex.service';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { UpdateKardexDto } from './dto/update-kardex.dto';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @HttpPost()
  create(@Body() dto: CreateKardexDto) {
    return this.kardexService.create(dto);
  }

  @Get()
  findAll() {
    return this.kardexService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kardexService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKardexDto) {
    return this.kardexService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kardexService.remove(+id);
  }

  @Get('stock/:id_celular')
  stockActual(@Param('id_celular') id_celular: string) {
    return this.kardexService.stockActual(+id_celular);
  }
}
