import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      contrasena: hashedPassword,
    });

    return this.usuarioRepository.save(usuario);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Usuario>> {
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');
    return paginate<Usuario>(queryBuilder, options);
  }

  findOne(id: string) {
    return this.usuarioRepository.findOne({ where: { id_usuario: id } });
  }

  async findByCorreo(correo: string) {
    return this.usuarioRepository.findOne({ where: { correo } });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) return null;

    if (updateUsuarioDto.contrasena) {
      updateUsuarioDto.contrasena = await bcrypt.hash(
        updateUsuarioDto.contrasena,
        10,
      );
    }

    Object.assign(usuario, updateUsuarioDto);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });
    if (!usuario) return null;

    return this.usuarioRepository.remove(usuario);
  }
}
