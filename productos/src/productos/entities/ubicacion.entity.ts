import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BodegaEntity } from './bodega.entity';

@Entity('ubicacion')
export class UbicacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id_ubicacion: string;

  @ManyToOne(() => BodegaEntity)
  @JoinColumn({ name: 'id_bodega' })
  bodega: BodegaEntity;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  tipo: string;
}