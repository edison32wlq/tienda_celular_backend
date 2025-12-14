import { IsString } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsString()
  id_proveedor: string;

  @IsString()
  id_usuario: string;

  @IsString()
  fecha_emision: Date;

  @IsString()
  estado: string;

  @IsString()
  total: number;
}
