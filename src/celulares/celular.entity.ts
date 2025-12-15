import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('celulares')
export class Celular {
  @PrimaryGeneratedColumn()
  id_celular: number;

  @Column({ length: 50 })
  codigo: string;

  @Column({ length: 50 })
  marca: string;

  @Column({ length: 50 })
  modelo: string;

  @Column({ length: 30 })
  color: string;

  @Column({ length: 30 })
  almacenamiento: string;

  @Column({ length: 30 })
  ram: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_venta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_compra: number;

  @Column()
  stock_actual: number;

  @Column({ length: 20 })
  estado: string;

  @Column({ type: 'text' })
  descripcion: string;
}
