import { IsUUID, IsInt, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateDetalleFacturaDto {
  @IsUUID()
  @IsNotEmpty()
  id_factura: string;

  @IsUUID()
  @IsNotEmpty()
  id_celular: string;

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
