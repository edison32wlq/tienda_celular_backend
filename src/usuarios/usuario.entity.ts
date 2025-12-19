import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToOne, OneToMany, JoinColumn, ManyToOne
} from 'typeorm';
import { Rol } from 'src/roles/rol.entity';
import { PerfilCliente } from '../perfil-clientes/perfilCliente.entity';
import { OrdenCompra } from '../orden-compras/ordenCompra.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid', { name: 'id_usuario' })
  id_usuario: string;

  @Column({ type: 'uuid', name: 'id_rol' })
  id_rol: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id_rol' })
  rol: Rol;

  @OneToOne(() => PerfilCliente, (perfil) => perfil.usuario)
  perfilCliente: PerfilCliente;

  @OneToMany(() => OrdenCompra, (orden) => orden.usuario)
  ordenesCompra: OrdenCompra[];

  @Column({ unique: true })
  usuario: string;

  @Column()
  contrasena: string;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  correo: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ nullable: true })
  profile: string;
}
