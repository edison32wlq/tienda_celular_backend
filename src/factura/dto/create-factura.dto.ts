import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  numero_factura: string;

  @IsDateString()
  fecha_emision: Date;

  @IsNumber()
  id_cliente: number;

  @IsNumber()
  id_usuario: number;

  @IsString()
  metodo_pago: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  total: number;
}
