import { IsOptional, IsString } from 'class-validator';

export class UpdateRolDto {
  @IsString()
  @IsOptional()
  nombre_rol: string;

  @IsString()
  @IsOptional()
  descripcion: string;
}
