import { IsInt, IsNumber } from 'class-validator';

export class CreateProductoCarritoDto {
  @IsInt()
  id_carrito: number;

  @IsInt()
  id_celular: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
