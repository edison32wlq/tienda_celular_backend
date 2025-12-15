import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CelularesService } from './celulares.service';
import { CreateCelularDto } from './dto/create-celular.dto';
import { UpdateCelularDto } from './dto/update-celular.dto';

@Controller('celulares')
export class CelularesController {
  constructor(private readonly celularesService: CelularesService) {}

  @Post()
  create(@Body() createCelularDto: CreateCelularDto) {
    return this.celularesService.create(createCelularDto);
  }

  @Get()
  findAll() {
    return this.celularesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.celularesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCelularDto: UpdateCelularDto) {
    return this.celularesService.update(id, updateCelularDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.celularesService.remove(id);
  }
}
