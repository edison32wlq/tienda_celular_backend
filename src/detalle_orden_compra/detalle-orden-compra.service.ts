import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { DetalleOrdenCompra } from './detalleOrdenCompra.entity';
import { CreateDetalleOrdenCompraDto } from './dto/create-detalleOrdenCompra.dto';
import { UpdateDetalleOrdenCompraDto } from './dto/update-detalleOrdenCompra.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class DetalleOrdenCompraService {
  constructor(
    @InjectRepository(DetalleOrdenCompra)
    private readonly detalleOrdenCompraRepository: Repository<DetalleOrdenCompra>,
  ) {}

  async create(dto: CreateDetalleOrdenCompraDto): Promise<DetalleOrdenCompra | null> {
    try {
      const detalle = this.detalleOrdenCompraRepository.create(dto);
      return await this.detalleOrdenCompraRepository.save(detalle);
    } catch (err) {
      console.error('Error creating detalle_orden_compra:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<DetalleOrdenCompra> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.detalleOrdenCompraRepository.createQueryBuilder('detalle');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'id_orden_compra':
            case 'id_celular':
            case 'cantidad':
            case 'costo_unitario':
            case 'subtotal':
              query.andWhere(`CAST(detalle.${searchField} AS TEXT) ILIKE :search`, {
                search: `%${search}%`,
              });
              break;
            default:
              query.andWhere(
                `(CAST(detalle.id_orden_compra AS TEXT) ILIKE :search OR CAST(detalle.id_celular AS TEXT) ILIKE :search)`,
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            `(CAST(detalle.id_orden_compra AS TEXT) ILIKE :search OR CAST(detalle.id_celular AS TEXT) ILIKE :search OR CAST(detalle.cantidad AS TEXT) ILIKE :search)`,
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`detalle.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<DetalleOrdenCompra>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving detalle_orden_compra:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<DetalleOrdenCompra | null> {
    try {
      return await this.detalleOrdenCompraRepository.findOne({
        where: { id_detalle_oc: Number(id) },
      });
    } catch (err) {
      console.error('Error finding detalle_orden_compra:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateDetalleOrdenCompraDto): Promise<DetalleOrdenCompra | null> {
    try {
      const detalle = await this.findOne(id);
      if (!detalle) return null;

      Object.assign(detalle, dto);
      return await this.detalleOrdenCompraRepository.save(detalle);
    } catch (err) {
      console.error('Error updating detalle_orden_compra:', err);
      return null;
    }
  }

  async remove(id: string): Promise<DetalleOrdenCompra | null> {
    try {
      const detalle = await this.findOne(id);
      if (!detalle) return null;

      return await this.detalleOrdenCompraRepository.remove(detalle);
    } catch (err) {
      console.error('Error deleting detalle_orden_compra:', err);
      return null;
    }
  }
}
