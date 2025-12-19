import {IsOptional, IsUUID, IsDateString, IsString, IsNumber,
} from 'class-validator';

export class UpdateOrdenCompraDto {
  @IsOptional()
  @IsUUID()
  id_proveedor?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsDateString()
  fecha_emision?: Date;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  total?: number;
}
