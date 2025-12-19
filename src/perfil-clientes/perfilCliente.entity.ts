import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('perfil_clientes') 
export class PerfilCliente {
  @PrimaryGeneratedColumn('uuid', { name: 'id_cliente' })
  id_cliente: string;

  @Column({ type: 'uuid', name: 'id_usuario', unique: true })
  id_usuario: string;

  @OneToOne(() => Usuario, (usuario) => usuario.perfilCliente, { eager: true })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id_usuario' })
  usuario: Usuario;

  @Column()
  cedula: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string; 
}
