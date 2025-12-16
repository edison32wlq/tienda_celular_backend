import { IsOptional, IsString } from 'class-validator';

export class UpdateOrdenCompraDto {
  
  @IsString()
  @IsOptional()
  id_proveedor: string;

  @IsString()
  @IsOptional()
  id_usuario: string;

  @IsString()
  @IsOptional()
  fecha_emision: Date;

  @IsString()
  @IsOptional()
  estado: string;

  @IsString()
  @IsOptional()
  total: number;
}
