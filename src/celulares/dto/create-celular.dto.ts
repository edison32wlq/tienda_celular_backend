import { IsInt, IsNumber, IsString } from 'class-validator';

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

  @IsNumber()
  precio_venta: number;

  @IsNumber()
  costo_compra: number;

  @IsInt()
  stock_actual: number;

  @IsString()
  estado: string;

  @IsString()
  descripcion: string;
}
