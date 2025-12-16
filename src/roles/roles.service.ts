import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  create(createRolDto: CreateRolDto) {
    const rol = this.rolRepository.create(createRolDto);
    return this.rolRepository.save(rol);
  }

  findAll() {
    return this.rolRepository.find();
  }

  findOne(id: string) {
    return this.rolRepository.findOne({ where: { id_rol: id } });
  }

  async update(id: string, updateRolDto: UpdateRolDto) {
    const rol = await this.rolRepository.findOne({ where: { id_rol : id } });
    if (!rol) return null;
    Object.assign(rol, updateRolDto);
    return this.rolRepository.save(rol);
  }

  async remove(id: string) {
    const rol = await this.rolRepository.findOne({ where: { id_rol : id } });
    if (!rol) return null;
    return this.rolRepository.remove(rol);
  }
}
