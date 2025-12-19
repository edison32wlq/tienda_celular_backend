import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { PerfilCliente } from './perfilCliente.entity';
import { CreatePerfilClienteDto } from './dto/create-perfilCliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfilCliente.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class PerfilClientesService {
  constructor(
    @InjectRepository(PerfilCliente)
    private readonly repo: Repository<PerfilCliente>,
  ) {}

  async create(dto: CreatePerfilClienteDto): Promise<PerfilCliente | null> {
    try {
      const exists = await this.repo.findOne({ where: { id_usuario: dto.id_usuario } });
      if (exists) return null;

      const perfil = this.repo.create(dto);
      return await this.repo.save(perfil);
    } catch (err) {
      console.error('Error creating perfilCliente:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<PerfilCliente> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.repo.createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.usuario', 'usuario'); // porque tienes eager en la relación

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'cedula':
              query.where('perfil.cedula ILIKE :search', { search: `%${search}%` });
              break;
            case 'telefono':
              query.where('perfil.telefono ILIKE :search', { search: `%${search}%` });
              break;
            case 'direccion':
              query.where('perfil.direccion ILIKE :search', { search: `%${search}%` });
              break;
            default:
              query.where(
                '(perfil.cedula ILIKE :search OR perfil.telefono ILIKE :search OR perfil.direccion ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(perfil.cedula ILIKE :search OR perfil.telefono ILIKE :search OR perfil.direccion ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`perfil.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving perfilClientes:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<PerfilCliente | null> {
    try {
      return await this.repo.findOne({ where: { id_cliente: id } });
    } catch (err) {
      console.error('Error finding perfilCliente:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdatePerfilClienteDto): Promise<PerfilCliente | null> {
    try {
      const perfil = await this.repo.findOne({ where: { id_cliente: id } });
      if (!perfil) return null;

      Object.assign(perfil, dto);
      return await this.repo.save(perfil);
    } catch (err) {
      console.error('Error updating perfilCliente:', err);
      return null;
    }
  }

  async remove(id: string): Promise<PerfilCliente | null> {
    try {
      const perfil = await this.findOne(id);
      if (!perfil) return null;

      return await this.repo.remove(perfil);
    } catch (err) {
      console.error('Error deleting perfilCliente:', err);
      return null;
    }
  }
}
