import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductoCarrito } from '../producto_carrito/productoCarrito.entity';
import { DetalleFactura } from '../detalle_factura/detalle_factura.entity';
import { DetalleOrdenCompra } from '../detalle_orden_compra/detalleOrdenCompra.entity';
import { Kardex } from '../kardex/kardex.entity';

@Entity('celulares')
export class Celular {
  @PrimaryGeneratedColumn('uuid',{ name: 'id_celular' })
  id_celular: string;

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

  @OneToMany(() => DetalleFactura, (detalle) => detalle.celular)
  detallesFactura: DetalleFactura[];

  @OneToMany(() => DetalleOrdenCompra, (detalle) => detalle.celular)
  detallesOrdenCompra: DetalleOrdenCompra[];

  @OneToMany(() => Kardex, (k) => k.celular)
  movimientosKardex: Kardex[];
}
