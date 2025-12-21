import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleOrdenCompraService } from './detalle-orden-compra.service';
import { DetalleOrdenCompraController } from './detalle-orden-compra.controller';
import { DetalleOrdenCompra } from './detalleOrdenCompra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleOrdenCompra])],
  controllers: [DetalleOrdenCompraController],
  providers: [DetalleOrdenCompraService],
})
export class DetalleOrdenCompraModule {}
