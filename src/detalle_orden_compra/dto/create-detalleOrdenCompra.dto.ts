import { IsInt, IsNumber } from 'class-validator';

export class CreateDetalleOrdenCompraDto {
  @IsInt()
  id_orden_compra: number;

  @IsInt()
  id_celular: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  costo_unitario: number;

  @IsNumber()
  subtotal: number;
}
