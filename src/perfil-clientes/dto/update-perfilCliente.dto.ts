import { IsOptional, IsString } from 'class-validator';

export class UpdatePerfilClienteDto {
  @IsString()
  @IsOptional()
  id_usuario?: string;

  @IsString()
  @IsOptional()
  cesula?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}
