import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateDetalleFacturaDto {
  @IsInt()
  @Min(1)
  id_factura: number;

  @IsInt()
  @Min(1)
  id_celular: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio_unitario: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  subtotal: number;
}
