import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateDetalleFacturaDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  id_factura?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  id_celular?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_unitario?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal?: number;
}
