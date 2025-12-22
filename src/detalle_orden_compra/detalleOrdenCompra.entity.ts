import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdenCompra } from '../orden-compras/ordenCompra.entity';
import { Celular } from '../celulares/celular.entity';

@Entity('detalle_orden_compra')
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn('uuid', { name: 'id_detalle_oc' })
  id_detalle_oc: string;

  @Column({ type: 'uuid', name: 'id_orden_compra' })
  id_orden_compra: string;

  @ManyToOne(() => OrdenCompra, (orden) => orden.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_orden_compra', referencedColumnName: 'id_orden_compra' })
  ordenCompra: OrdenCompra;

  @Column({ type: 'uuid', name: 'id_celular' })
  id_celular: string;

  @ManyToOne(() => Celular, (celular) => celular.detallesOrdenCompra, { eager: true })
  @JoinColumn({ name: 'id_celular', referencedColumnName: 'id_celular' })
  celular: Celular;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
