import { IsUUID, IsInt, IsNumber } from 'class-validator';

export class CreateDetalleOrdenCompraDto {
  @IsUUID()
  id_orden_compra: string;

  @IsInt()
  id_celular: number;

  @IsInt()
  cantidad: number;

  @IsNumber()
  costo_unitario: number;

  @IsNumber()
  subtotal: number;
}
