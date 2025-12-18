import { IsInt, IsNumber, IsString, IsDateString, Min } from 'class-validator';

export class CreateKardexDto {
  @IsInt()
  @Min(1)
  id_celular: number;

  @IsDateString()
  fecha_movimiento: Date;

  @IsString()
  tipo_movimiento: string; // entrada / salida

  @IsString()
  origen: string; // COMPRA / VENTA / AJUSTE

  @IsInt()
  @Min(1)
  id_documento: number;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo_unitario: number;
}
