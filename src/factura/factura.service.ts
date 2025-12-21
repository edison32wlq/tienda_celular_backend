import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const factura = this.facturaRepository.create({
      numero_factura: createFacturaDto.numero_factura,
      fecha_emision: createFacturaDto.fecha_emision,
      id_cliente: createFacturaDto.id_cliente,
      id_usuario: createFacturaDto.id_usuario,
      metodo_pago: createFacturaDto.metodo_pago,
      subtotal: createFacturaDto.subtotal,
      iva: createFacturaDto.iva,
      total: createFacturaDto.total,
    });

    return this.facturaRepository.save(factura);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Factura>> {
    const queryBuilder = this.facturaRepository.createQueryBuilder('factura');
    return paginate<Factura>(queryBuilder, options);
  }

  findOne(id: number) {
    return this.facturaRepository.findOne({ where: { id_factura: id } });
  }

  async update(id: number, updateFacturaDto: UpdateFacturaDto) {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
    });

    if (!factura) throw new NotFoundException('Factura no encontrada');

    Object.assign(factura, updateFacturaDto);
    return this.facturaRepository.save(factura);
  }

  async remove(id: number) {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
    });

    if (!factura) throw new NotFoundException('Factura no encontrada');

    return this.facturaRepository.remove(factura);
  }
}
