import { IsInt, IsNumber, IsUUID } from 'class-validator';

export class CreateProductoCarritoDto {
  @IsUUID()
  id_carrito: string;

  @IsUUID()
    id_celular: string;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precio_unitario: number;
}
