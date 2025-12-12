import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid',{name: 'id_usuario'})
  id_usuario: string;

  @Column()
  id_rol: string;  

  @Column({ unique: true })
  usuario: string;

  @Column()
  contrasena: string;

  @Column()
  nombres: string; 
  
  @Column()
  apellidos: string; 
  
  @Column()
  correo: string;
  
  @Column()
  estado: string;  
}
