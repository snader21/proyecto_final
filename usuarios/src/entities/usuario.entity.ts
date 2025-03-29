import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena_hash: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_ultima_modificacion: Date;

  @ManyToMany(() => Rol)
  @JoinTable({
    name: 'usuario_roles',
    joinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
  })
  roles: Rol[];
}
