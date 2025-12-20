import { IsUUID, IsDateString, IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleOrdenCompraDto } from '../../detalle_orden_compra/dto/create-detalleOrdenCompra.dto';

export class CreateOrdenCompraDto {
  @IsUUID()
  @IsNotEmpty()
  id_proveedor: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsDateString()
  @IsOptional()
  fecha_emision?: string;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleOrdenCompraDto)
  detalles: CreateDetalleOrdenCompraDto[];
}
