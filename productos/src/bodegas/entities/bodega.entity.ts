import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UbicacionEntity } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('bodega')
export class BodegaEntity {
  @PrimaryGeneratedColumn('uuid')
  id_bodega: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column('int')
  capacidad: number;

  @OneToMany(() => UbicacionEntity, (ubicacion) => ubicacion.bodega)
  ubicaciones: UbicacionEntity[];
}
