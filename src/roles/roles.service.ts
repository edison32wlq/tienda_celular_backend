import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto): Promise<Rol | null> {
    try {
      const rol = this.rolRepository.create(dto);
      return await this.rolRepository.save(rol);
    } catch (err) {
      console.error('Error creating rol:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Rol> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.rolRepository.createQueryBuilder('rol');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'nombre_rol':
              query.where('rol.nombre_rol ILIKE :search', { search: `%${search}%` });
              break;

            case 'descripcion':
              query.where('rol.descripcion ILIKE :search', { search: `%${search}%` });
              break;

            default:
              query.where(
                '(rol.nombre_rol ILIKE :search OR rol.descripcion ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(rol.nombre_rol ILIKE :search OR rol.descripcion ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`rol.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Rol>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving roles:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Rol | null> {
    try {
      return await this.rolRepository.findOne({ where: { id_rol: id } });
    } catch (err) {
      console.error('Error finding rol:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateRolDto): Promise<Rol | null> {
    try {
      const rol = await this.rolRepository.findOne({ where: { id_rol: id } });
      if (!rol) return null;

      Object.assign(rol, dto);
      return await this.rolRepository.save(rol);
    } catch (err) {
      console.error('Error updating rol:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Rol | null> {
    try {
      const rol = await this.findOne(id);
      if (!rol) return null;

      return await this.rolRepository.remove(rol);
    } catch (err) {
      console.error('Error deleting rol:', err);
      return null;
    }
  }
}
