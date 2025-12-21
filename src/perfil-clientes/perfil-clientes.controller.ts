import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerfilClientesService } from './perfil-clientes.service';
import { CreatePerfilClienteDto } from './dto/create-perfilCliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfilCliente.dto';
import { PerfilCliente } from './perfilCliente.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('perfilClientes')
export class PerfilClientesController {
  constructor(private readonly service: PerfilClientesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreatePerfilClienteDto) {
    const perfil = await this.service.create(dto);

    if (!perfil) throw new InternalServerErrorException('Failed to create perfilCliente');
    return new SuccessResponseDto('PerfilCliente created successfully', perfil);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<PerfilCliente>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.service.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve perfilClientes');

    return new SuccessResponseDto('PerfilClientes retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const perfil = await this.service.findOne(id);
    if (!perfil) throw new NotFoundException('PerfilCliente not found');
    return new SuccessResponseDto('PerfilCliente retrieved successfully', perfil);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePerfilClienteDto) {
    const perfil = await this.service.update(id, dto);
    if (!perfil) throw new NotFoundException('PerfilCliente not found');
    return new SuccessResponseDto('PerfilCliente updated successfully', perfil);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const perfil = await this.service.remove(id);
    if (!perfil) throw new NotFoundException('PerfilCliente not found');
    return new SuccessResponseDto('PerfilCliente deleted successfully', perfil);
  }
}
