import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PerfilCliente } from '../perfil-clientes/perfilCliente.entity';
import { ProductoCarrito } from '../producto_carrito/productoCarrito.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn({ name: 'id_carrito' })
  id_carrito: number;

  @Column({ type: 'int', name: 'id_cliente' })
  id_cliente: number;

  @ManyToOne(() => PerfilCliente, (cliente) => cliente.carritos, { eager: true })
  @JoinColumn({ name: 'id_cliente', referencedColumnName: 'id_cliente' })
  cliente: PerfilCliente;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ length: 20 })
  estado: string;

  @OneToMany(() => ProductoCarrito, (pc) => pc.carrito, { cascade: true })
  productos: ProductoCarrito[];
}
