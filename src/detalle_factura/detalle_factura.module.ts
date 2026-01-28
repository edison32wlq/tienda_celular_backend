import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleFacturaService } from './detalle_factura.service';
import { DetalleFacturaController } from './detalle_factura.controller';
import { DetalleFactura } from './detalle_factura.entity';
import { Celular } from '../celulares/celular.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleFactura, Celular])],
  controllers: [DetalleFacturaController],
  providers: [DetalleFacturaService],
})
export class DetalleFacturaModule {}
