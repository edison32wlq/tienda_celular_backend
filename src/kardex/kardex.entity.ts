import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('kardex')
export class Kardex {
  @PrimaryGeneratedColumn()
  id_kardex: number;

  @Column()
  id_celular: number;

  @Column({ type: 'timestamp' })
  fecha_movimiento: Date;

  @Column({ length: 20 })
  tipo_movimiento: string; // entrada / salida

  @Column({ length: 20 })
  origen: string; // COMPRA / VENTA / AJUSTE

  @Column()
  id_documento: number; // id_orden_compra o id_factura

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column()
  stock_anterior: number;

  @Column()
  stock_nuevo: number;
}
