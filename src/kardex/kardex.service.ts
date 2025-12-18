import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kardex } from './kardex.entity';
import { CreateKardexDto } from './dto/create-kardex.dto';
import { UpdateKardexDto } from './dto/update-kardex.dto';

@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(Kardex)
    private readonly kardexRepository: Repository<Kardex>,
  ) {}

  async create(dto: CreateKardexDto) {
    // 1) Buscar el último kardex del mismo producto (id_celular)
    const ultimo = await this.kardexRepository.findOne({
      where: { id_celular: dto.id_celular },
      order: { fecha_movimiento: 'DESC' },
    });

    const stockAnterior = ultimo ? ultimo.stock_nuevo : 0;

    // 2) Calcular stock_nuevo
    let stockNuevo = stockAnterior;

    if (dto.tipo_movimiento === 'entrada') {
      stockNuevo = stockAnterior + dto.cantidad;
    } else if (dto.tipo_movimiento === 'salida') {
      stockNuevo = stockAnterior - dto.cantidad;
    } else {
      throw new BadRequestException(
        'tipo_movimiento debe ser "entrada" o "salida"',
      );
    }

    // 3) Evitar stock negativo
    if (stockNuevo < 0) {
      throw new BadRequestException(
        'Stock insuficiente para realizar la salida',
      );
    }

    // 4) Guardar registro kardex
    const kardex = this.kardexRepository.create({
      id_celular: dto.id_celular,
      fecha_movimiento: dto.fecha_movimiento,
      tipo_movimiento: dto.tipo_movimiento,
      origen: dto.origen,
      id_documento: dto.id_documento,
      cantidad: dto.cantidad,
      costo_unitario: dto.costo_unitario,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
    });

    return this.kardexRepository.save(kardex);
  }

  findAll() {
    return this.kardexRepository.find();
  }

  findOne(id: number) {
    return this.kardexRepository.findOne({ where: { id_kardex: id } });
  }

  async update(id: number, dto: UpdateKardexDto) {
    const kardex = await this.kardexRepository.findOne({
      where: { id_kardex: id },
    });
    if (!kardex) throw new NotFoundException('Movimiento kardex no encontrado');

    Object.assign(kardex, dto);
    return this.kardexRepository.save(kardex);
  }

  async remove(id: number) {
    const kardex = await this.kardexRepository.findOne({
      where: { id_kardex: id },
    });
    if (!kardex) throw new NotFoundException('Movimiento kardex no encontrado');

    return this.kardexRepository.remove(kardex);
  }

  // Stock actual por id_celular
  async stockActual(id_celular: number) {
    const ultimo = await this.kardexRepository.findOne({
      where: { id_celular },
      order: { fecha_movimiento: 'DESC' },
    });

    return {
      id_celular,
      stock_actual: ultimo ? ultimo.stock_nuevo : 0,
    };
  }
}
