import { IsInt, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateProductoCarritoDto {
  @IsUUID()
  @IsOptional()
  id_carrito: string;

  @IsUUID()
    @IsOptional()
    id_celular?: string;

  @IsInt()
  @IsOptional()
  cantidad: number;

  @IsNumber()
  @IsOptional()
  precio_unitario: number;
}
