import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCarritoDto {
  @IsInt()
  @IsOptional()
  id_cliente: number;

  @IsDateString()
  @IsOptional()
  fecha_creacion: Date;

  @IsString()
  @IsOptional()
  estado: string;
}
