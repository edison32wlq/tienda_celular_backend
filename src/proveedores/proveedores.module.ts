import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProveedoresController } from './proveedores.controller';
import { ProveedoresService } from './proveedores.service';
import { Proveedor, ProveedorSchema } from './proveedor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Proveedor.name, schema: ProveedorSchema }]),
  ],
  controllers: [ProveedoresController],
  providers: [ProveedoresService],
})
export class ProveedoresModule {}
