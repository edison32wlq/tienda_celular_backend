import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Rol } from './rol.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() dto: CreateRolDto) {
    const rol = await this.rolesService.create(dto);
    if (!rol) throw new InternalServerErrorException('Failed to create rol');
    return new SuccessResponseDto('Rol created successfully', rol);
  }
 
  @Get()
  async findAll(@Query() query: QueryDto): Promise<SuccessResponseDto<Pagination<Rol>>> {
    if (query.limit && query.limit > 100) query.limit = 100;

    const result = await this.rolesService.findAll(query);
    if (!result) throw new InternalServerErrorException('Could not retrieve roles');

    return new SuccessResponseDto('Roles retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rol = await this.rolesService.findOne(id);
    if (!rol) throw new NotFoundException('Rol not found');
    return new SuccessResponseDto('Rol retrieved successfully', rol);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateRolDto) {
    const rol = await this.rolesService.update(id, dto);
    if (!rol) throw new NotFoundException('Rol not found');
    return new SuccessResponseDto('Rol updated successfully', rol);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const rol = await this.rolesService.remove(id);
    if (!rol) throw new NotFoundException('Rol not found');
    return new SuccessResponseDto('Rol deleted successfully', rol);
  }
}
