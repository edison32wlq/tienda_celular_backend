import { IsUUID, IsDateString, IsString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateKardexDto {
  @IsUUID()
  id_celular: string;

  @IsDateString()
  fecha_movimiento: string;

  @IsString()
  tipo_movimiento: string;

  @IsString()
  origen: string;

  @IsUUID()
  id_documento: string;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  costo_unitario: number;
}
