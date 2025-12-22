import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { ProductoCarrito } from './productoCarrito.entity';
import { CreateProductoCarritoDto } from './dto/create-productoCarrito.dto';
import { UpdateProductoCarritoDto } from './dto/update-productoCarrito.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ProductosCarritoService {
  constructor(
    @InjectRepository(ProductoCarrito)
    private readonly productoCarritoRepository: Repository<ProductoCarrito>,
  ) {}

  async create(dto: CreateProductoCarritoDto): Promise<ProductoCarrito | null> {
    try {
      const entity = this.productoCarritoRepository.create(dto);
      return await this.productoCarritoRepository.save(entity);
    } catch (err) {
      console.error('Error creating producto_carrito:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<ProductoCarrito> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.productoCarritoRepository.createQueryBuilder('pc');

      if (search) {
        // Campos: id_carrito, id_celular, cantidad, precio_unitario
        if (searchField) {
          switch (searchField) {
            case 'id_carrito':
            case 'id_celular':
            case 'cantidad':
            case 'precio_unitario':
              query.andWhere(`CAST(pc.${searchField} AS TEXT) ILIKE :search`, {
                search: `%${search}%`,
              });
              break;
            default:
              query.andWhere(
                `(CAST(pc.id_carrito AS TEXT) ILIKE :search OR CAST(pc.id_celular AS TEXT) ILIKE :search)`,
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            `(CAST(pc.id_carrito AS TEXT) ILIKE :search OR CAST(pc.id_celular AS TEXT) ILIKE :search OR CAST(pc.cantidad AS TEXT) ILIKE :search)`,
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`pc.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<ProductoCarrito>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving producto_carrito:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<ProductoCarrito | null> {
    try {
      return await this.productoCarritoRepository.findOne({
        where: { id_producto_carrito: id },
      });
    } catch (err) {
      console.error('Error finding producto_carrito:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateProductoCarritoDto): Promise<ProductoCarrito | null> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return null;

      Object.assign(entity, dto);
      return await this.productoCarritoRepository.save(entity);
    } catch (err) {
      console.error('Error updating producto_carrito:', err);
      return null;
    }
  }

  async remove(id: string): Promise<ProductoCarrito | null> {
    try {
      const entity = await this.findOne(id);
      if (!entity) return null;

      return await this.productoCarritoRepository.remove(entity);
    } catch (err) {
      console.error('Error deleting producto_carrito:', err);
      return null;
    }
  }
}
