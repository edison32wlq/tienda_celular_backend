import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Factura } from '../factura/factura.entity';
import { Celular } from '../celulares/celular.entity';

@Entity('detalle_factura')
export class DetalleFactura {
  @PrimaryGeneratedColumn('uuid', { name: 'id_detalle_factura' })
  id_detalle_factura: string;

  @Column({ type: 'uuid', name: 'id_factura' })
  id_factura: string;

  @ManyToOne(() => Factura, (factura) => factura.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_factura', referencedColumnName: 'id_factura' })
  factura: Factura;

  @Column({ type: 'int', name: 'id_celular' })
  id_celular: number;

  @ManyToOne(() => Celular, (celular) => celular.detallesFactura, { eager: true })
  @JoinColumn({ name: 'id_celular', referencedColumnName: 'id_celular' })
  celular: Celular;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
