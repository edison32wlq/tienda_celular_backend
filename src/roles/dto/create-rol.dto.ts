import { IsString } from 'class-validator';

export class CreateRolDto {
  @IsString()
  nombre_rol: string;

  @IsString()
  descripcion: string;
}
