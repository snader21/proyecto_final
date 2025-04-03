import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BodegaEntity } from '../../bodegas/entities/bodega.entity';
import { MovimientoInventarioEntity } from '../../movimientos-inventario/entities/movimiento-inventario.entity';

@Entity('ubicacion')
export class UbicacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id_ubicacion: string;

  @ManyToOne(() => BodegaEntity)
  @JoinColumn({ name: 'id_bodega' })
  bodega: BodegaEntity;

  @OneToMany(
    () => MovimientoInventarioEntity,
    (movimiento_inventario) => movimiento_inventario.ubicacion,
  )
  movimientos_inventario: MovimientoInventarioEntity[];

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  tipo: string;
}
