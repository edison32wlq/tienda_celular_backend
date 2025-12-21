import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductoCarritoDto {
  @IsInt()
  @IsOptional()
  id_carrito: number;

  @IsInt()
  @IsOptional()
  id_celular: number;

  @IsInt()
  @IsOptional()
  cantidad: number;

  @IsNumber()
  @IsOptional()
  precio_unitario: number;
}
