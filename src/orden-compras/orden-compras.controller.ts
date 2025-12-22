import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdenComprasService } from './orden-compras.service';
import { CreateOrdenCompraDto } from './dto/create-ordenCompra.dto';
import { UpdateOrdenCompraDto } from './dto/update-ordenCompra.dto';
import { OrdenCompra } from './ordenCompra.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('ordenCompras')
export class OrdenComprasController {
  constructor(private readonly service: OrdenComprasService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateOrdenCompraDto) {
    const orden = await this.service.create(dto);
    if (!orden) throw new InternalServerErrorException('Failed to create ordenCompra');

    return new SuccessResponseDto('OrdenCompra created successfully', orden);
  }

  @Get()
  async findAll(
    @Query() query: QueryDto,
    @Query('estado') estado?: string,
  ): Promise<SuccessResponseDto<Pagination<OrdenCompra>>> {

    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.service.findAll(query, estado);
    if (!result) throw new InternalServerErrorException('Could not retrieve ordenCompras');

    return new SuccessResponseDto('OrdenCompras retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const orden = await this.service.findOne(id);
    if (!orden) throw new NotFoundException('OrdenCompra not found');

    return new SuccessResponseDto('OrdenCompra retrieved successfully', orden);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOrdenCompraDto) {
    const orden = await this.service.update(id, dto);
    if (!orden) throw new NotFoundException('OrdenCompra not found');

    return new SuccessResponseDto('OrdenCompra updated successfully', orden);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const orden = await this.service.remove(id);
    if (!orden) throw new NotFoundException('OrdenCompra not found');

    return new SuccessResponseDto('OrdenCompra deleted successfully', orden);
  }
}
