import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Celular } from '../celulares/celular.entity';

@Entity('kardex')
export class Kardex {
  @PrimaryGeneratedColumn('uuid', { name: 'id_kardex' })
  id_kardex: string;

  @Column({ type: 'uuid', name: 'id_celular' })
  id_celular: string;

  @ManyToOne(
    () => Celular,
    (celular) => celular.movimientosKardex,
    { eager: true, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'id_celular', referencedColumnName: 'id_celular' })
  celular: Celular;

  @Column({ type: 'timestamp' })
  fecha_movimiento: Date;

  @Column({ length: 20 })
  tipo_movimiento: string;

  @Column({ length: 20 })
  origen: string;

  @Column({ type: 'uuid' })
  id_documento: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column()
  stock_anterior: number;

  @Column()
  stock_nuevo: number;
}