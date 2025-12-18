import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './ordenCompra.entity';
import { CreateOrdenCompraDto } from './dto/create-ordenCompra.dto';
import { UpdateOrdenCompraDto } from './dto/update-ordenCompra.dto';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class OrdenComprasService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly ordenCompraRepository: Repository<OrdenCompra>,
  ) {}

  create(createOrdenCompraDto: CreateOrdenCompraDto) {
    const ordenCompra = this.ordenCompraRepository.create(createOrdenCompraDto);
    return this.ordenCompraRepository.save(ordenCompra);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<OrdenCompra>> {
    const queryBuilder = this.ordenCompraRepository.createQueryBuilder('ordenCompra');
    return paginate<OrdenCompra>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.ordenCompraRepository.findOne({ where: { id_orden_compra: id } });
  }

  async update(id: string, updateOrdenCompraDto: UpdateOrdenCompraDto) {
    const ordenCompra = await this.ordenCompraRepository.findOne({ where: { id_orden_compra: id } });
    if (!ordenCompra) return null;
    Object.assign(ordenCompra, updateOrdenCompraDto);
    return this.ordenCompraRepository.save(ordenCompra);
  }

  async remove(id: string) {
    const ordenCompra = await this.ordenCompraRepository.findOne({ where: { id_orden_compra: id } });
    if (!ordenCompra) return null;
    return this.ordenCompraRepository.remove(ordenCompra);
  }
}
