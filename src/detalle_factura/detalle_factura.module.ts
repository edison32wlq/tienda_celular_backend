import { Module } from '@nestjs/common';
import { DetalleFacturaController } from './detalle_factura.controller';
import { DetalleFacturaService } from './detalle_factura.service';

@Module({
  controllers: [DetalleFacturaController],
  providers: [DetalleFacturaService]
})
export class DetalleFacturaModule {}
