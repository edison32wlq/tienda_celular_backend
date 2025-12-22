import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleFactura } from './detalle_factura.entity';
import { CreateDetalleFacturaDto } from './dto/create-detalle_factura.dto';
import { UpdateDetalleFacturaDto } from './dto/update-detalle_factura.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class DetalleFacturaService {
  constructor(
    @InjectRepository(DetalleFactura)
    private readonly detalleFacturaRepository: Repository<DetalleFactura>,
  ) {}

  async create(dto: CreateDetalleFacturaDto) {
    const detalle = this.detalleFacturaRepository.create({
      id_factura: dto.id_factura,
      id_celular: dto.id_celular,
      cantidad: dto.cantidad,
      precio_unitario: dto.precio_unitario,
      subtotal: dto.subtotal,
    });

    return this.detalleFacturaRepository.save(detalle);
  }

  async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<DetalleFactura>> {
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

    Object.assign(detalle, dto);
    return this.detalleFacturaRepository.save(detalle);
  }

  async remove(id: string) {
    const detalle = await this.detalleFacturaRepository.findOne({
      where: { id_detalle_factura: id },
    });

    if (!detalle) throw new NotFoundException('Detalle factura no encontrado');

    return this.detalleFacturaRepository.remove(detalle);
  }
}
