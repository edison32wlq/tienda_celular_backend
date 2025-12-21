import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacturaModule } from './factura/factura.module';
import { DetalleFacturaModule } from './detalle_factura/detalle_factura.module';
import { KardexModule } from './kardex/kardex.module';
import { AuthModule } from './auth/auth.module';

import { CarritoModule } from './carrito/carrito.module';
import { CelularesModule } from './celulares/celulares.module';
import { DetalleOrdenCompraModule } from './detalle_orden_compra/detalle-orden-compra.module';
import { ProductosCarritoModule } from './producto_carrito/productos-carrito.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { AuditLogsModule } from './auditlog/audit-logs.module';

import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PerfilClientesModule } from './perfil-clientes/perfil-clientes.module';
import { OrdenComprasModule } from './orden-compras/orden-compras.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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

    UsuariosModule,
    RolesModule,
    PerfilClientesModule,
    OrdenComprasModule,
    CarritoModule,
    CelularesModule,
    DetalleOrdenCompraModule,
    ProductosCarritoModule,
    ProveedoresModule,
    AuditLogsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
