import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsNotEmpty()
  @IsString()
  usuario_id: string;

  @IsNotEmpty()
  @IsString()
  accion: string;

  @IsNotEmpty()
  @IsString()
  entidad: string;

  @IsOptional()
  @IsString()
  entidad_id?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  ip?: string;
}
