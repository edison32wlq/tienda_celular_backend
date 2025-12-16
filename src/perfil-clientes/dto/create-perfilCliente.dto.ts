import { IsString } from 'class-validator';

export class CreatePerfilClienteDto {
  @IsString()
  id_usuario: string;

  @IsString()
  cedula: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion: string;
}
