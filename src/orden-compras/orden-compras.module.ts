import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenComprasService } from './orden-compras.service';
import { OrdenComprasController } from './orden-compras.controller';
import { OrdenCompra } from './ordenCompra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenCompra])],
  controllers: [OrdenComprasController],
  providers: [OrdenComprasService],
})
export class OrdenComprasModule {}
