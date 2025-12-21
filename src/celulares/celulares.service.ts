import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Celular } from './celular.entity';
import { CreateCelularDto } from './dto/create-celular.dto';
import { UpdateCelularDto } from './dto/update-celular.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class CelularesService {
  constructor(
    @InjectRepository(Celular)
    private readonly celularRepository: Repository<Celular>,
  ) {}

  async create(dto: CreateCelularDto): Promise<Celular | null> {
    try {
      const celular = this.celularRepository.create(dto);
      return await this.celularRepository.save(celular);
    } catch (err) {
      console.error('Error creating celular:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Celular> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.celularRepository.createQueryBuilder('celular');

      if (search) {
        // Campos permitidos para buscar:
        // codigo, marca, modelo, color, almacenamiento, ram, estado, descripcion,
        // precio_venta, costo_compra, stock_actual (estos últimos como texto)
        if (searchField) {
          switch (searchField) {
            case 'codigo':
            case 'marca':
            case 'modelo':
            case 'color':
            case 'almacenamiento':
            case 'ram':
            case 'estado':
            case 'descripcion':
              query.andWhere(`celular.${searchField} ILIKE :search`, { search: `%${search}%` });
              break;

            case 'precio_venta':
            case 'costo_compra':
            case 'stock_actual':
              query.andWhere(`CAST(celular.${searchField} AS TEXT) ILIKE :search`, {
                search: `%${search}%`,
              });
              break;

            default:
              query.andWhere(
                `(celular.codigo ILIKE :search OR celular.marca ILIKE :search OR celular.modelo ILIKE :search OR celular.estado ILIKE :search OR celular.descripcion ILIKE :search)`,
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            `(celular.codigo ILIKE :search OR celular.marca ILIKE :search OR celular.modelo ILIKE :search OR celular.color ILIKE :search OR celular.almacenamiento ILIKE :search OR celular.ram ILIKE :search OR celular.estado ILIKE :search OR celular.descripcion ILIKE :search OR CAST(celular.stock_actual AS TEXT) ILIKE :search)`,
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`celular.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Celular>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving celulares:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Celular | null> {
    try {
      return await this.celularRepository.findOne({ where: { id_celular: Number(id) } });
    } catch (err) {
      console.error('Error finding celular:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCelularDto): Promise<Celular | null> {
    try {
      const celular = await this.findOne(id);
      if (!celular) return null;

      Object.assign(celular, dto);
      return await this.celularRepository.save(celular);
    } catch (err) {
      console.error('Error updating celular:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Celular | null> {
    try {
      const celular = await this.findOne(id);
      if (!celular) return null;

      return await this.celularRepository.remove(celular);
    } catch (err) {
      console.error('Error deleting celular:', err);
      return null;
    }
  }
}
