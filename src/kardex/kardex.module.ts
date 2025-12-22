import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KardexService } from './kardex.service';
import { KardexController } from './kardex.controller';
import { Kardex } from './kardex.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kardex])],
  controllers: [KardexController],
  providers: [KardexService],
})
export class KardexModule {}
