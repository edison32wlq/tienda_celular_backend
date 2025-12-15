import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductosCarritoService } from './productos-carrito.service';
import { CreateProductoCarritoDto } from './dto/create-productoCarrito.dto';
import { UpdateProductoCarritoDto } from './dto/update-productoCarrito.dto';

@Controller('productosCarrito')
export class ProductosCarritoController {
  constructor(private readonly productosCarritoService: ProductosCarritoService) {}

  @Post()
  create(@Body() createProductoCarritoDto: CreateProductoCarritoDto) {
    return this.productosCarritoService.create(createProductoCarritoDto);
  }

  @Get()
  findAll() {
    return this.productosCarritoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosCarritoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductoCarritoDto: UpdateProductoCarritoDto) {
    return this.productosCarritoService.update(id, updateProductoCarritoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosCarritoService.remove(id);
  }
}
