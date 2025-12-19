import { Entity, Column,  PrimaryGeneratedColumn,  ManyToOne,  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

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

  @Column({ type: 'date' })
  fecha_emision: Date;

  @Column()
  estado: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
