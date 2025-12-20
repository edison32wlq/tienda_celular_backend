import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { DetalleOrdenCompra } from '../detalle_orden_compra/detalle-orden-compra.entity';

@Entity('orden_compras')
export class OrdenCompra {
  @PrimaryGeneratedColumn('uuid')
  id_orden_compra: string;

  @Column({ type: 'uuid' })
  id_proveedor: string;

  @Column({ type: 'uuid', name: 'id_usuario' })
  id_usuario: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.ordenesCompra, { eager: true })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(
    () => DetalleOrdenCompra,
    (detalle) => detalle.ordenCompra,
    { cascade: true },
  )
  detalles: DetalleOrdenCompra[];

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column()
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
