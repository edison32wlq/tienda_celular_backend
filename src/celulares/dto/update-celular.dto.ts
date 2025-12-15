import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCelularDto {
  @IsString()
  @IsOptional()
  codigo: string;

  @IsString()
  @IsOptional()
  marca: string;

  @IsString()
  @IsOptional()
  modelo: string;

  @IsString()
  @IsOptional()
  color: string;

  @IsString()
  @IsOptional()
  almacenamiento: string;

  @IsString()
  @IsOptional()
  ram: string;

  @IsNumber()
  @IsOptional()
  precio_venta: number;

  @IsNumber()
  @IsOptional()
  costo_compra: number;

  @IsInt()
  @IsOptional()
  stock_actual: number;

  @IsString()
  @IsOptional()
  estado: string;

  @IsString()
  @IsOptional()
  descripcion: string;
}
