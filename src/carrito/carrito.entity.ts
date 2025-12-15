import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn()
  id_carrito: number;

  @Column()
  id_cliente: number;

  @Column({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ length: 20 })
  estado: string;
}
