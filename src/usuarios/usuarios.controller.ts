import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  BadRequestException, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() dto: CreateUsuarioDto) {
    const usuario = await this.usuariosService.create(dto);
    if (!usuario) throw new InternalServerErrorException('Failed to create usuario');
    return new SuccessResponseDto('Usuario created successfully', usuario);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Query('estado') estado?: string,
  ): Promise<SuccessResponseDto<Pagination<Usuario>>> {

    if (query.limit && query.limit > 100) query.limit = 100;

    if (estado !== undefined && estado !== 'true' && estado !== 'false') {
      throw new BadRequestException('Invalid value for "estado". Use "true" or "false".');
    }

    const result = await this.usuariosService.findAll(
      query,
      estado === undefined ? undefined : estado === 'true',
    );

    if (!result) throw new InternalServerErrorException('Could not retrieve usuarios');
    return new SuccessResponseDto('Usuarios retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuariosService.findOne(id);
    if (!usuario) throw new NotFoundException('Usuario not found');
    return new SuccessResponseDto('Usuario retrieved successfully', usuario);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    const usuario = await this.usuariosService.update(id, dto);
    if (!usuario) throw new NotFoundException('Usuario not found');
    return new SuccessResponseDto('Usuario updated successfully', usuario);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const usuario = await this.usuariosService.remove(id);
    if (!usuario) throw new NotFoundException('Usuario not found');
    return new SuccessResponseDto('Usuario deleted successfully', usuario);
  }
}
