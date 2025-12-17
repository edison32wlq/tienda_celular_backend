import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { CarritoModule } from './carrito/carrito.module';
import { CelularesModule } from './celulares/celulares.module';
import { DetalleOrdenCompraModule } from './detalle_orden_compra/detalle-orden-compra.module';
import { ProductosCarritoModule } from './producto_carrito/productos-carrito.module';
import { ProveedoresModule } from './proveedores/proveedores.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    CarritoModule,
    CelularesModule,
    DetalleOrdenCompraModule,
    ProductosCarritoModule,
    ProveedoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
