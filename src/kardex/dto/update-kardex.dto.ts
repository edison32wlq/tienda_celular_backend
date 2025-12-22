import {
  IsOptional,
  IsInt,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdateKardexDto {
  @IsOptional()
  @IsInt()
  id_celular?: string;

  @IsOptional()
  @IsDateString()
  fecha_movimiento?: Date;

  @IsOptional()
  @IsString()
  tipo_movimiento?: string;

  @IsOptional()
  @IsString()
  origen?: string;

  @IsOptional()
  @IsInt()
  id_documento?: number;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  costo_unitario?: number;

  @IsOptional()
  @IsInt()
  stock_anterior?: number;

  @IsOptional()
  @IsInt()
  stock_nuevo?: number;
}
