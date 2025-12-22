import { IsUUID, IsInt, IsNumber } from 'class-validator';

export class CreateDetalleOrdenCompraDto {
  @IsUUID()
  id_orden_compra: string;
  
  @IsUUID()
  id_celular: string;

  @IsInt()
  cantidad: number;

  @IsNumber()
  costo_unitario: number;

  @IsNumber()
  subtotal: number;
}
