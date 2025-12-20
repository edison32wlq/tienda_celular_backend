import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario | null> {
    try {
      const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

      const usuario = this.usuarioRepository.create({
        ...dto,
        contrasena: hashedPassword,
      });

      return await this.usuarioRepository.save(usuario);
    } catch (err) {
      console.error('Error creating usuario:', err);
      return null;
    }
  }

  async findAll(
    queryDto: QueryDto,
    estado?: boolean,
  ): Promise<Pagination<Usuario> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;

      const query = this.usuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.rol', 'rol'); 

      if (estado !== undefined) {
        query.andWhere('usuario.estado = :estado', { estado });
      }

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'usuario':
              query.andWhere('usuario.usuario ILIKE :search', {
                search: `%${search}%`,
              });
              break;

            case 'correo':
              query.andWhere('usuario.correo ILIKE :search', {
                search: `%${search}%`,
              });
              break;

            case 'nombres':
              query.andWhere('usuario.nombres ILIKE :search', {
                search: `%${search}%`,
              });
              break;

            case 'apellidos':
              query.andWhere('usuario.apellidos ILIKE :search', {
                search: `%${search}%`,
              });
              break;

            default:
              query.andWhere(
                '(usuario.usuario ILIKE :search OR usuario.correo ILIKE :search OR usuario.nombres ILIKE :search OR usuario.apellidos ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.andWhere(
            '(usuario.usuario ILIKE :search OR usuario.correo ILIKE :search OR usuario.nombres ILIKE :search OR usuario.apellidos ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`usuario.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Usuario>(query, { page, limit });
    } catch (err) {
      console.error('Error retrieving usuarios:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Usuario | null> {
    try {
      return await this.usuarioRepository.findOne({
        where: { id_usuario: id },
        relations: ['rol'],
      });
    } catch (err) {
      console.error('Error finding usuario:', err);
      return null;
    }
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    try {
      return await this.usuarioRepository.findOne({ where: { correo } });
    } catch (err) {
      console.error('Error finding usuario by correo:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario | null> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id_usuario: id },
      });
      if (!usuario) return null;

      if (dto.contrasena) {
        dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
      }

      Object.assign(usuario, dto);
      return await this.usuarioRepository.save(usuario);
    } catch (err) {
      console.error('Error updating usuario:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Usuario | null> {
    try {
      const usuario = await this.findOne(id);
      if (!usuario) return null;

      return await this.usuarioRepository.remove(usuario);
    } catch (err) {
      console.error('Error deleting usuario:', err);
      return null;
    }
  }
}
