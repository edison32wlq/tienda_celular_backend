import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('perfilClientes')
export class PerfilCliente {
  @PrimaryGeneratedColumn('uuid')
  id_cliente: string;

  @Column()
  id_usuario: string;
  
  @Column()
  cedula: string;

  @Column()
  telefono: string;

  @Column()
  descripcion: string;
}
