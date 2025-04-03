import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Permiso } from './permiso.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_ultima_modificacion: Date;

  @ManyToMany(() => Usuario, (usuario) => usuario.roles)
  usuarios: Usuario[];

  @ManyToMany(() => Permiso, (permiso) => permiso.roles)
  @JoinTable({
    name: 'rol_permisos',
    joinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permiso_id',
      referencedColumnName: 'id',
    },
  })
  permisos: Permiso[];
}
