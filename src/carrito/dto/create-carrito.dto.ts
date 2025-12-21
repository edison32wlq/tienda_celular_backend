import { IsInt, IsString } from 'class-validator';

export class CreateCarritoDto {
  @IsInt()
  id_cliente: number;

  @IsString()
  estado: string; 
}
