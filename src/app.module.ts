import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [FacturaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
