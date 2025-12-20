import { IsOptional, IsString } from 'class-validator';

export class UpdateAuditLogDto {
  @IsOptional()
  @IsString()
  usuario_id?: string;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsString()
  entidad?: string;

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
