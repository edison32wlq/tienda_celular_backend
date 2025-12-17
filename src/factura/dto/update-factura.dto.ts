import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateFacturaDto {
  @IsOptional()
  @IsString()
  numero_factura?: string;

  @IsOptional()
  @IsDateString()
  fecha_emision?: Date;

  @IsOptional()
  @IsNumber()
  id_cliente?: number;

  @IsOptional()
  @IsNumber()
  id_usuario?: number;

  @IsOptional()
  @IsString()
  metodo_pago?: string;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  iva?: number;

  @IsOptional()
  @IsNumber()
  total?: number;
}
