import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoEntity } from '../../productos/entities/producto.entity';
import { UbicacionEntity } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('inventario')
export class InventarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id_inventario: string;

  @ManyToOne(() => ProductoEntity)
  @JoinColumn({ name: 'id_producto' })
  producto: ProductoEntity;

  @ManyToOne(() => UbicacionEntity)
  @JoinColumn({ name: 'id_ubicacion' })
  ubicacion: UbicacionEntity;

  @Column('int')
  cantidad_disponible: number;

  @Column('int')
  cantidad_minima: number;

  @Column('int')
  cantidad_maxima: number;

  @Column({ type: 'date' })
  fecha_actualizacion: Date;
}
