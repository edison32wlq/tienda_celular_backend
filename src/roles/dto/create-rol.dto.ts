import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  nombre_rol: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
