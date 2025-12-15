import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoCarrito } from './productoCarrito.entity';
import { CreateProductoCarritoDto } from './dto/create-productoCarrito.dto';
import { UpdateProductoCarritoDto } from './dto/update-productoCarrito.dto';

@Injectable()
export class ProductosCarritoService {
  constructor(
    @InjectRepository(ProductoCarrito)
    private readonly productoCarritoRepository: Repository<ProductoCarrito>,
  ) {}

  create(createProductoCarritoDto: CreateProductoCarritoDto) {
    const productoCarrito = this.productoCarritoRepository.create(createProductoCarritoDto);
    return this.productoCarritoRepository.save(productoCarrito);
  }

  findAll() {
    return this.productoCarritoRepository.find();
  }

  findOne(id: string) {
    return this.productoCarritoRepository.findOne({ where: { id_producto_carrito: Number(id) } });
  }

  async update(id: string, updateProductoCarritoDto: UpdateProductoCarritoDto) {
    const productoCarrito = await this.productoCarritoRepository.findOne({
      where: { id_producto_carrito: Number(id) },
    });
    if (!productoCarrito) return null;
    Object.assign(productoCarrito, updateProductoCarritoDto);
    return this.productoCarritoRepository.save(productoCarrito);
  }

  async remove(id: string) {
    const productoCarrito = await this.productoCarritoRepository.findOne({
      where: { id_producto_carrito: Number(id) },
    });
    if (!productoCarrito) return null;
    return this.productoCarritoRepository.remove(productoCarrito);
  }
}
