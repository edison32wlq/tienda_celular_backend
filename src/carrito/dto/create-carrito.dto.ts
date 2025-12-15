import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateCarritoDto {
  @IsInt()
  id_cliente: number;

  @IsDateString()
  fecha_creacion: Date;

  @IsString()
  estado: string;
}
