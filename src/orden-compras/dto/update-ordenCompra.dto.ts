import {IsOptional, IsUUID, IsDateString, IsString, IsArray,ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleOrdenCompraDto } from '../../detalle_orden_compra/dto/create-detalle-orden-compra.dto';

export class UpdateOrdenCompraDto {
  @IsOptional()
  @IsUUID()
  id_proveedor?: string;

  @IsOptional()
  @IsUUID()
  id_usuario?: string;

  @IsOptional()
  @IsDateString()
  fecha_emision?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleOrdenCompraDto)
  detalles?: CreateDetalleOrdenCompraDto[];
}
