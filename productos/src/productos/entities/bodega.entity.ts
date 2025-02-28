import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
