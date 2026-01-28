import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  NotFoundException, InternalServerErrorException, UseGuards, UseInterceptors,
  UploadedFile, BadRequestException, Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { memoryStorage } from 'multer';
import type { Response } from 'express';

import { CelularesService } from './celulares.service';
import { CreateCelularDto } from './dto/create-celular.dto';
import { UpdateCelularDto } from './dto/update-celular.dto';
import { Celular } from './celular.entity';

import { QueryDto } from 'src/common/dto/query.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

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

  @Get(':id/imagen')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.celularesService.getImage(id);
    if (!image) throw new NotFoundException('Imagen no encontrada');

    res.setHeader('Content-Type', image.mime || 'application/octet-stream');
    res.send(image.data);
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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/imagen')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('Formato de imagen no permitido'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
    }),
  )
  async uploadImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Imagen requerida');

    const celular = await this.celularesService.updateImage(id, file);
    if (!celular) throw new NotFoundException('Celular not found');

    return new SuccessResponseDto('Imagen subida correctamente', celular);
  }
}
