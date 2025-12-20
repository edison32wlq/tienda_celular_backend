import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateCarritoDto {
  @IsInt()
  @IsOptional()
  id_cliente?: number;

  @IsString()
  @IsOptional()
  estado?: string;
}
