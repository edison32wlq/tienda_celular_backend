import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  MinLength,
  IsUUID,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsUUID()
  @IsNotEmpty()
  id_rol: string;

  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
