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

  async create(dto: CreateFacturaDto): Promise<Factura> {
  const factura = this.facturaRepository.create({
    numero_factura: dto.numero_factura,
    fecha_emision: new Date(dto.fecha_emision),
    id_cliente: dto.id_cliente,
    id_usuario: dto.id_usuario,
    metodo_pago: dto.metodo_pago,
    subtotal: dto.subtotal,
    iva: dto.iva,
    total: dto.total,
  });

  return this.facturaRepository.save(factura);
}


  async findAll(options: IPaginationOptions): Promise<Pagination<Factura>> {
    const queryBuilder = this.facturaRepository.createQueryBuilder('factura');
    return paginate<Factura>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.facturaRepository.findOne({ where: { id_factura: id } });
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
    });

    if (!factura) throw new NotFoundException('Factura no encontrada');

    Object.assign(factura, updateFacturaDto);
    return this.facturaRepository.save(factura);
  }

  async remove(id: string) {
    const factura = await this.facturaRepository.findOne({
      where: { id_factura: id },
    });

    if (!factura) throw new NotFoundException('Factura no encontrada');

    return this.facturaRepository.remove(factura);
  }
}
