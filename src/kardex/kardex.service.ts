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
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(Kardex)
    private readonly kardexRepository: Repository<Kardex>,
  ) {}

  async create(dto: CreateKardexDto) {
    const ultimo = await this.kardexRepository.findOne({
      where: { id_celular: dto.id_celular },
      order: { fecha_movimiento: 'DESC' },
    });

    const stockAnterior = ultimo ? ultimo.stock_nuevo : 0;

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

    if (stockNuevo < 0) {
      throw new BadRequestException(
        'Stock insuficiente para realizar la salida',
      );
    }

    const kardex = this.kardexRepository.create({
      id_celular: dto.id_celular,
      fecha_movimiento: new Date(dto.fecha_movimiento),
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

  async findAll(options: IPaginationOptions): Promise<Pagination<Kardex>> {
    const queryBuilder = this.kardexRepository
      .createQueryBuilder('kardex')
      .orderBy('kardex.fecha_movimiento', 'DESC');

    return paginate<Kardex>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.kardexRepository.findOne({ where: { id_kardex: id } });
  }

  async update(id: string, dto: UpdateKardexDto) {
    const kardex = await this.kardexRepository.findOne({
      where: { id_kardex: id },
    });
    if (!kardex) throw new NotFoundException('Movimiento kardex no encontrado');

    Object.assign(kardex, dto);
    return this.kardexRepository.save(kardex);
  }

  async remove(id: string) {
    const kardex = await this.kardexRepository.findOne({
      where: { id_kardex: id },
    });
    if (!kardex) throw new NotFoundException('Movimiento kardex no encontrado');

    return this.kardexRepository.remove(kardex);
  }

  async stockActual(id_celular: string) {
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
