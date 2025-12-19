import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdatePerfilClienteDto {
  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
