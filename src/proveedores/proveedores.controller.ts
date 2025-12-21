import {
  Controller, Get, Post, Put, Delete, Param, Body,
  NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  async create(@Body() dto: CreateProveedorDto) {
    const proveedor = await this.proveedoresService.create(dto);
    if (!proveedor) throw new InternalServerErrorException('Failed to create proveedor');
    return proveedor;
  }

  @Get()
  async findAll() {
    const proveedores = await this.proveedoresService.findAll();
    if (!proveedores) throw new InternalServerErrorException('Could not retrieve proveedores');
    return proveedores;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const proveedor = await this.proveedoresService.findOne(id);
    if (!proveedor) throw new NotFoundException('Proveedor not found');
    return proveedor;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProveedorDto) {
    const proveedor = await this.proveedoresService.update(id, dto);
    if (!proveedor) throw new NotFoundException('Proveedor not found');
    return proveedor;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const proveedor = await this.proveedoresService.remove(id);
    if (!proveedor) throw new NotFoundException('Proveedor not found');
    return proveedor;
  }
}
