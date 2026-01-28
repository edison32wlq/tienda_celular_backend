import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

// ✅ importa Celular
import { Celular } from '../celulares/celular.entity';

@Injectable()
export class DetalleFacturaService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(DetalleFactura)
    private readonly detalleFacturaRepository: Repository<DetalleFactura>,

    // ✅ repo de celulares para restar stock
    @InjectRepository(Celular)
    private readonly celularRepository: Repository<Celular>,
  ) {}

  async create(dto: CreateDetalleFacturaDto) {
    // ✅ Transacción: o se guarda todo + resta stock, o no se guarda nada
    return this.dataSource.transaction(async (manager) => {
      const celRepo = manager.getRepository(Celular);
      const detRepo = manager.getRepository(DetalleFactura);

      // 1) buscar celular y bloquear la fila (evita compras simultáneas)
      const celular = await celRepo.findOne({
        where: { id_celular: dto.id_celular as any }, // si ya es string UUID, puedes quitar "as any"
        lock: { mode: 'pessimistic_write' },
      });

      if (!celular) throw new NotFoundException('Celular no encontrado');

      const stockActual = Number((celular as any).stock_actual ?? 0);
      const cantidad = Number(dto.cantidad);

      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        throw new BadRequestException('Cantidad inválida');
      }

      // 2) validar stock
      if (stockActual < cantidad) {
        throw new BadRequestException(
          `Stock insuficiente. Stock: ${stockActual}, pedido: ${cantidad}`,
        );
      }

      // 3) crear detalle
      const detalle = detRepo.create({
        id_factura: dto.id_factura,
        id_celular: dto.id_celular as any,
        cantidad: dto.cantidad,
        precio_unitario: dto.precio_unitario,
        subtotal: dto.subtotal,
      });

      const saved = await detRepo.save(detalle);

      // 4) restar stock
      await celRepo.decrement(
        { id_celular: dto.id_celular as any },
        'stock_actual',
        cantidad,
      );

      return saved;
    });
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<DetalleFactura>> {
    const queryBuilder =
      this.detalleFacturaRepository.createQueryBuilder('detalle_factura');
    return paginate<DetalleFactura>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.detalleFacturaRepository.findOne({
      where: { id_detalle_factura: id },
    });
  }

  async update(id: string, dto: UpdateDetalleFacturaDto) {
    const detalle = await this.detalleFacturaRepository.findOne({
      where: { id_detalle_factura: id },
    });

    if (!detalle) throw new NotFoundException('Detalle factura no encontrado');

    // ⚠️ No ajusto stock en update para no complicarlo.
    // Si tú quieres editar detalles y recalcular stock, me dices y lo armamos.

    Object.assign(detalle, dto);
    return this.detalleFacturaRepository.save(detalle);
  }

  async remove(id: string) {
    const detalle = await this.detalleFacturaRepository.findOne({
      where: { id_detalle_factura: id },
    });

    if (!detalle) throw new NotFoundException('Detalle factura no encontrado');

    // ⚠️ No devuelvo stock al eliminar para evitar inconsistencias.
    // Si lo necesitas, también se puede con transacción.

    return this.detalleFacturaRepository.remove(detalle);
  }
}
