import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePerfilClienteDto {
  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsString()
  @IsNotEmpty()
  cedula: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;
}
