import { Usuario } from 'src/usuarios/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({ unique: true })
  nombre_rol: string;

  @Column()
  descripcion: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
