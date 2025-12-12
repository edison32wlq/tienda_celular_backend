import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  id_rol?: string;

  @IsOptional()
  @IsString()
  usuario?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  estado?: string;
}
