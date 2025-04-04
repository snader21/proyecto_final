import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductoEntity } from '../../productos/entities/producto.entity';
import { UbicacionEntity } from '../../ubicaciones/entities/ubicacion.entity';

@Entity('movimiento_inventario')
export class MovimientoInventarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id_movimiento: string;

  @ManyToOne(
    () => ProductoEntity,
    (producto) => producto.movimientos_inventario,
  )
  @JoinColumn({ name: 'id_producto' })
  producto: ProductoEntity;

  @ManyToOne(
    () => UbicacionEntity,
    (ubicacion) => ubicacion.movimientos_inventario,
  )
  @JoinColumn({ name: 'id_ubicacion' })
  ubicacion: UbicacionEntity;

  @Column({ nullable: true })
  id_pedido: string;

  @Column('int')
  cantidad: number;

  @Column()
  tipo_movimiento: string;

  @Column()
  id_usuario: string;

  @Column({ type: 'date' })
  fecha_registro: Date;
}
