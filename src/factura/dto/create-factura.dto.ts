import { IsString, IsNumber, IsDateString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  numero_factura: string;

  @IsDateString()
  fecha_emision: string;

  @IsUUID()
  id_cliente: string; 

  @IsUUID()
  id_usuario: string; 

  @IsString()
  @IsNotEmpty()
  metodo_pago: string;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  iva: number;

  @IsNumber()
  total: number;
}
