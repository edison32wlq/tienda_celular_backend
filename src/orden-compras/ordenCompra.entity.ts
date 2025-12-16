import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ordenCompras')
export class OrdenCompra {
  @PrimaryGeneratedColumn('uuid')
  id_orden_compra: string;

  @Column()
  id_proveedor: string;

  @Column()
  id_usuario: string;

  @Column()
  fecha_emision: Date;

  @Column()
  estado: string;

  @Column()
  total: number;
}
