import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosCarritoService } from './productos-carrito.service';
import { ProductosCarritoController } from './productos-carrito.controller';
import { ProductoCarrito } from './productoCarrito.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoCarrito])],
  controllers: [ProductosCarritoController],
  providers: [ProductosCarritoService],
})
export class ProductosCarritoModule {}
