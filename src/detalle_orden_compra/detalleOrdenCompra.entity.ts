import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('detalle_orden_compra')
export class DetalleOrdenCompra {
  @PrimaryGeneratedColumn()
  id_detalle_oc: number;

  @Column()
  id_orden_compra: number;

  @Column()
  id_celular: number;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
