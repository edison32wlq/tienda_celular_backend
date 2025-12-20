import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true })
  usuario_id: string;

  @Prop({ required: true })
  accion: string;

  @Prop({ required: true })
  entidad: string;

  @Prop()
  entidad_id?: string;

  @Prop()
  descripcion?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  ip?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
