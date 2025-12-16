import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('factura')
export class Factura {

  @PrimaryGeneratedColumn()
  id_factura: number;

  @Column()
  numero_factura: string;

  @Column()
  fecha_emision: Date;

  @Column()
  id_cliente: number;  

  @Column()
  id_usuario: number;  

  @Column({ length: 30 })
  metodo_pago: string;

  @Column()
  subtotal: number;

  @Column()
  iva: number;

  @Column()
  total: number;
}
