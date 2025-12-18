import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PerfilClientesService } from './perfil-clientes.service';
import { CreatePerfilClienteDto } from './dto/create-perfilCliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfilCliente.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PerfilCliente } from './perfilCliente.entity';

@Controller('perfilClientes')
export class PerfilClientesController {
  constructor(private readonly perfilClientesService: PerfilClientesService) {}

  @Post()
  create(@Body() createPerfilClienteDto: CreatePerfilClienteDto) {
    return this.perfilClientesService.create(createPerfilClienteDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<PerfilCliente>> {
    limit = limit > 100 ? 100 : limit;
    return this.perfilClientesService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perfilClientesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePerfilClienteDto: UpdatePerfilClienteDto) {
    return this.perfilClientesService.update(id, updatePerfilClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perfilClientesService.remove(id);
  }
}
