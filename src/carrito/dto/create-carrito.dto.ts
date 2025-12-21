import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateCarritoDto {
  @IsUUID()
  @IsNotEmpty()
  id_cliente: string;

  @IsString()
  @IsNotEmpty()
  estado: string;
}
