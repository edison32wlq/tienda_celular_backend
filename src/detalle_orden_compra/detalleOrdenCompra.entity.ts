import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrdenCompra } from '../orden-compras/ordenCompra.entity';

@Entity('detalle_orden_compra')
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id_detalle_oc: number;

  @Column({ type: 'uuid' })
  id_orden_compra: string;

  @ManyToOne(
    () => OrdenCompra,
    (orden) => orden.detalles,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_orden_compra' })
  ordenCompra: OrdenCompra;

  @Column()
  id_celular: number;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
