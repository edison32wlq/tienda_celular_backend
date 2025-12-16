import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle_factura/detalle_factura.module';
import { KardexModule } from './kardex/kardex.module';

@Module({
  imports: [FacturaModule, DetalleFacturaModule, KardexModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
