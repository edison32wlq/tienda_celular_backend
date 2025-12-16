import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleOrdenCompra } from './detalleOrdenCompra.entity';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalleOrdenCompra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalleOrdenCompra.dto';

@Injectable()
export class DetalleOrdenCompraService {
  constructor(
    @InjectRepository(DetalleOrdenCompra)
    private readonly detalleOrdenCompraRepository: Repository<DetalleOrdenCompra>,
  ) {}

  create(dto: CreateDetalleOrdenCompraDto) {
    const detalle = this.detalleOrdenCompraRepository.create(dto);
    return this.detalleOrdenCompraRepository.save(detalle);
  }

  findAll() {
    return this.detalleOrdenCompraRepository.find();
  }

  findOne(id: string) {
    return this.detalleOrdenCompraRepository.findOne({
      where: { id_detalle_oc: Number(id) },
    });
  }

  async update(id: string, dto: UpdateDetalleOrdenCompraDto) {
    const detalle = await this.detalleOrdenCompraRepository.findOne({
      where: { id_detalle_oc: Number(id) },
    });
    if (!detalle) return null;
    Object.assign(detalle, dto);
    return this.detalleOrdenCompraRepository.save(detalle);
  }

  async remove(id: string) {
    const detalle = await this.detalleOrdenCompraRepository.findOne({
      where: { id_detalle_oc: Number(id) },
    });
    if (!detalle) return null;
    return this.detalleOrdenCompraRepository.remove(detalle);
  }
}
