import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Celular } from './celular.entity';
import { CreateCelularDto } from './dto/create-celular.dto';
import { UpdateCelularDto } from './dto/update-celular.dto';

@Injectable()
export class CelularesService {
  constructor(
    @InjectRepository(Celular)
    private readonly celularRepository: Repository<Celular>,
  ) {}

  create(createCelularDto: CreateCelularDto) {
    const celular = this.celularRepository.create(createCelularDto);
    return this.celularRepository.save(celular);
  }

  findAll() {
    return this.celularRepository.find();
  }

  findOne(id: string) {
    return this.celularRepository.findOne({ where: { id_celular: Number(id) } });
  }

  async update(id: string, updateCelularDto: UpdateCelularDto) {
    const celular = await this.celularRepository.findOne({ where: { id_celular: Number(id) } });
    if (!celular) return null;
    Object.assign(celular, updateCelularDto);
    return this.celularRepository.save(celular);
  }

  async remove(id: string) {
    const celular = await this.celularRepository.findOne({ where: { id_celular: Number(id) } });
    if (!celular) return null;
    return this.celularRepository.remove(celular);
  }
}
