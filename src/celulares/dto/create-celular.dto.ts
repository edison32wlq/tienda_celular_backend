import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCelularDto {
  @IsString()
  codigo: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;

  @IsString()
  color: string;

  @IsString()
  almacenamiento: string;

  @IsString()
  ram: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio_venta: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  costo_compra: number;

  @IsInt()
  stock_actual: number;

  @IsString()
  estado: string;

  @IsString()
  descripcion: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsOptional()
  imagen_data?: Buffer;

  @IsString()
  @IsOptional()
  imagen_mime?: string;
}
