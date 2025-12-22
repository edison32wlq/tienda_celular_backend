import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Carrito } from './carrito.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,
  ) {}

  async create(dto: CreateCarritoDto): Promise<Carrito | null> {
  try {
    const carrito = this.carritoRepository.create({
      id_cliente: dto.id_cliente,
      estado: dto.estado,
    });

    return await this.carritoRepository.save(carrito);
  } catch (err) {
    console.error('Error creating carrito:', err);
    return null;
  }
}


  async findAll(queryDto: QueryDto): Promise<Pagination<Carrito> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.carritoRepository.createQueryBuilder('carrito');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'estado':
              query.andWhere('carrito.estado ILIKE :search', { search: `%${search}%` });
              break;
            case 'id_cliente':
              query.andWhere('CAST(carrito.id_cliente AS TEXT) ILIKE :search', { search: `%${search}%` });
              break;
            default:
              query.andWhere(
                '(carrito.estado ILIKE :search OR CAST(carrito.id_cliente AS TEXT) ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            '(carrito.estado ILIKE :search OR CAST(carrito.id_cliente AS TEXT) ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`carrito.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Carrito>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving carritos:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Carrito | null> {
    try {
      return await this.carritoRepository.findOne({ where: { id_carrito: id } });
    } catch (err) {
      console.error('Error finding carrito:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCarritoDto): Promise<Carrito | null> {
    try {
      const carrito = await this.findOne(id);
      if (!carrito) return null;

      Object.assign(carrito, dto);
      return await this.carritoRepository.save(carrito);
    } catch (err) {
      console.error('Error updating carrito:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Carrito | null> {
    try {
      const carrito = await this.findOne(id);
      if (!carrito) return null;

      return await this.carritoRepository.remove(carrito);
    } catch (err) {
      console.error('Error deleting carrito:', err);
      return null;
    }
  }
}
