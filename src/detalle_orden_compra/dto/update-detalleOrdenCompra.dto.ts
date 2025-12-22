import { IsUUID, IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateDetalleOrdenCompraDto {
  @IsUUID()
  @IsOptional()
  id_celular?: string;

  @IsInt()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  costo_unitario?: number;

  @IsNumber()
  @IsOptional()
  subtotal?: number;
}
