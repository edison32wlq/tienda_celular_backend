import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CelularesService } from './celulares.service';
import { CelularesController } from './celulares.controller';
import { Celular } from './celular.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Celular])],
  controllers: [CelularesController],
  providers: [CelularesService],
})
export class CelularesModule {}
