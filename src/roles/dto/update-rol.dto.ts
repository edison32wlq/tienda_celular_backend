import { IsOptional, IsString } from 'class-validator';

export class UpdateRolDto {
  @IsOptional()
  @IsString()
  nombre_rol?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
