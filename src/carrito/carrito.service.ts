import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './carrito.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private readonly carritoRepository: Repository<Carrito>,
  ) {}

  create(createCarritoDto: CreateCarritoDto) {
    const carrito = this.carritoRepository.create(createCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  findAll() {
    return this.carritoRepository.find();
  }

  findOne(id: string) {
    return this.carritoRepository.findOne({ where: { id_carrito: Number(id) } });
  }

  async update(id: string, updateCarritoDto: UpdateCarritoDto) {
    const carrito = await this.carritoRepository.findOne({ where: { id_carrito: Number(id) } });
    if (!carrito) return null;
    Object.assign(carrito, updateCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async remove(id: string) {
    const carrito = await this.carritoRepository.findOne({ where: { id_carrito: Number(id) } });
    if (!carrito) return null;
    return this.carritoRepository.remove(carrito);
  }
}
