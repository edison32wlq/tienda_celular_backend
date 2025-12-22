import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from 'nestjs-typeorm-paginate';

import { CelularesService } from './celulares.service';
import { CreateCelularDto } from './dto/create-celular.dto';
import { UpdateCelularDto } from './dto/update-celular.dto';
import { Celular } from './celular.entity';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('celulares')
export class CelularesController {
  constructor(private readonly celularesService: CelularesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateCelularDto) {
    const celular = await this.celularesService.create(dto);
    if (!celular) throw new InternalServerErrorException('Failed to create celular');
    return new SuccessResponseDto('Celular created successfully', celular);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<Celular>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.celularesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve celulares');

    return new SuccessResponseDto('Celulares retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const celular = await this.celularesService.findOne(id);
    if (!celular) throw new NotFoundException('Celular not found');
    return new SuccessResponseDto('Celular retrieved successfully', celular);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCelularDto) {
    const celular = await this.celularesService.update(id, dto);
    if (!celular) throw new NotFoundException('Celular not found');
    return new SuccessResponseDto('Celular updated successfully', celular);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const celular = await this.celularesService.remove(id);
    if (!celular) throw new NotFoundException('Celular not found');
    return new SuccessResponseDto('Celular deleted successfully', celular);
  }
}
