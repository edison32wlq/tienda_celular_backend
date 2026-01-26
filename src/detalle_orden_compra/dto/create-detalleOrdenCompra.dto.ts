import { IsUUID, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateDetalleOrdenCompraDto {
  @IsUUID()
  id_celular: string;

  @IsInt()
  cantidad: number;

  @IsNumber()
  costo_unitario: number;

  @IsOptional()
  @IsNumber()
  subtotal?: number;
}
