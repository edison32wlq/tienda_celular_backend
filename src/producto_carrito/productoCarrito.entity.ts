import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Carrito } from '../carrito/carrito.entity';
import { Celular } from '../celulares/celular.entity';

@Entity('productos_carrito')
export class ProductoCarrito {
  @PrimaryGeneratedColumn({ name: 'id_producto_carrito' })
  id_producto_carrito: number;

  @Column({ type: 'int', name: 'id_carrito' })
  id_carrito: number;

  @ManyToOne(() => Carrito, (carrito) => carrito.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_carrito' })
  carrito: Carrito;

  @Column({ type: 'int', name: 'id_celular' })
  id_celular: number;

  @ManyToOne(() => Celular, (celular) => celular.productosCarrito, { eager: true })
  @JoinColumn({ name: 'id_celular', referencedColumnName: 'id_celular' })
  celular: Celular;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;
}
