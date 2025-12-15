import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productos_carrito')
export class ProductoCarrito {
  @PrimaryGeneratedColumn()
  id_producto_carrito: number;

  @Column()
  id_carrito: number;

  @Column()
  id_celular: number;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;
}
