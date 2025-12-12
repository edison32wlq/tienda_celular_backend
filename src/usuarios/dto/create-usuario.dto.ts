import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  id_rol: string; 

  @IsString()
  @IsNotEmpty()
  usuario: string;  

  @IsString()
  @IsNotEmpty()
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

  @IsString()
  @IsNotEmpty()
  estado: string;  
}
