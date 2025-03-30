import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({ length: 100 })
  recurso: string;

  @Column({ length: 50 })
  accion: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_ultima_modificacion: Date;

  @ManyToMany(() => Rol, (rol) => rol.permisos)
  roles: Rol[];
}
