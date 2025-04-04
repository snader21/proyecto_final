import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Rol } from './rol.entity';

export enum TipoRecurso {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
}

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  nombre: string;

  @Column({ length: 200, nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoRecurso,
    default: TipoRecurso.BACKEND,
  })
  tipoRecurso: TipoRecurso;

  @Column({ length: 100 })
  modulo: string;

  @Column({ length: 200, nullable: true })
  ruta: string;

  @ManyToMany(() => Rol, (rol) => rol.permisos)
  roles: Rol[];
}
