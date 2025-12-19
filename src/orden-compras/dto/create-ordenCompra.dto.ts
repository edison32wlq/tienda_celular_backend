import {IsUUID,IsDateString,IsString,IsNumber,IsNotEmpty,
} from 'class-validator';

export class CreateOrdenCompraDto {
  @IsUUID()
  @IsNotEmpty()
  id_proveedor: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsDateString()
  fecha_emision: Date;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsNumber()
  total: number;
}
