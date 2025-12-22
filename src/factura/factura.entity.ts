import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { PerfilCliente } from '../perfil-clientes/perfilCliente.entity';
import { Usuario } from '../usuarios/usuario.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('uuid', { name: 'id_factura' })
  id_factura: string;

  @Column({ unique: true })
  numero_factura: string;

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column({ type: 'uuid', name: 'id_cliente' })
  id_cliente: string;

  @ManyToOne(() => PerfilCliente, (cliente) => cliente.facturas, { eager: true })
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id_cliente' })
  cliente: PerfilCliente;

  @Column({ type: 'uuid', name: 'id_usuario' })
  id_usuario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.facturas, { eager: true })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => DetalleFactura, (detalle) => detalle.factura, { cascade: true })
  detalles: DetalleFactura[];

  @Column({ length: 30 })
  metodo_pago: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
