import { IsOptional, IsString, IsEmail, IsBoolean, MinLength, IsUUID } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsUUID()
  id_rol?: string;

  @IsOptional()
  @IsString()
  usuario?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  contrasena?: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;

  @IsOptional()
  @IsString()
  profile?: string;
}
