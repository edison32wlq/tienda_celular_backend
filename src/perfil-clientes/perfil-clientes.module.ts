import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilClientesService } from './perfil-clientes.service';
import { PerfilClientesController } from './perfil-clientes.controller';
import { PerfilCliente } from './perfilCliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilCliente])],
  controllers: [PerfilClientesController],
  providers: [PerfilClientesService],
})
export class PerfilClientesModule {}
