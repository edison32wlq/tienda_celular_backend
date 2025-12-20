import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductoCarrito } from '../producto_carrito/productoCarrito.entity';

@Entity('celulares')
export class Celular {
  @PrimaryGeneratedColumn({ name: 'id_celular' })
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

  @Column({ type: 'int', default: 0 })
  stock_actual: number;

  @Column({ length: 20 })
  estado: string;

  @Column({ type: 'text' })
  descripcion: string;

  @OneToMany(() => ProductoCarrito, (pc) => pc.celular)
  productosCarrito: ProductoCarrito[];
}
