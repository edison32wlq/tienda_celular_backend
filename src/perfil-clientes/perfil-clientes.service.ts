import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilCliente } from './perfilCliente.entity';
import { CreatePerfilClienteDto } from './dto/create-perfilCliente.dto';
import { UpdatePerfilClienteDto } from './dto/update-perfilCliente.dto';

@Injectable()
export class PerfilClientesService {
  constructor(
    @InjectRepository(PerfilCliente)
    private readonly perfilClienteRepository: Repository<PerfilCliente>,
  ) {}

  create(createPerfilClienteDto: CreatePerfilClienteDto) {
    const perfilCliente = this.perfilClienteRepository.create(createPerfilClienteDto);
    return this.perfilClienteRepository.save(perfilCliente);
  }

  findAll() {
    return this.perfilClienteRepository.find();
  }

  findOne(id: string) {
    return this.perfilClienteRepository.findOne({ where: { id_cliente: id } });
  }

  async update(id: string, updatePerfilClienteDto: UpdatePerfilClienteDto) {
    const perfilCliente = await this.perfilClienteRepository.findOne({ where: { id_cliente: id } });
    if (!perfilCliente) return null;
    Object.assign(perfilCliente, updatePerfilClienteDto);
    return this.perfilClienteRepository.save(perfilCliente);
  }

  async remove(id: string) {
    const perfilCliente = await this.perfilClienteRepository.findOne({ where: { id_cliente: id } });
    if (!perfilCliente) return null;
    return this.perfilClienteRepository.remove(perfilCliente);
  }
}
