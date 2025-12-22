import { IsOptional, IsUUID, IsDateString, IsString } from 'class-validator';

export class UpdateOrdenCompraDto {
  @IsOptional()
  @IsUUID()
  id_proveedor?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsDateString()
  fecha_emision?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
