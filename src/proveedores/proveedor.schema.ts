import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Proveedor extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  ruc: string;

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: true })
  contacto: string;
}

export const ProveedorSchema = SchemaFactory.createForClass(Proveedor);
