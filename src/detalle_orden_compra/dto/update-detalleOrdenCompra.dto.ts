import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateDetalleOrdenCompraDto {
  @IsInt()
  @IsOptional()
  id_orden_compra: number;

  @IsInt()
  @IsOptional()
  id_celular: number;

  @IsInt()
  @IsOptional()
  cantidad: number;

  @IsNumber()
  @IsOptional()
  costo_unitario: number;

  @IsNumber()
  @IsOptional()
  subtotal: number;
}
