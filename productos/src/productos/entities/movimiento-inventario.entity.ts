import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { UbicacionEntity } from './ubicacion.entity';

@Entity('movimiento_inventario')
export class MovimientoInventarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id_movimiento: string;

  @ManyToOne(() => ProductoEntity)
  @JoinColumn({ name: 'id_producto' })
  producto: ProductoEntity;

  @ManyToOne(() => UbicacionEntity)
  @JoinColumn({ name: 'id_ubicacion' })
  ubicacion: UbicacionEntity;

  @Column()
  id_pedido: string;

  @Column('int')
  cantidad: number;

  @Column()
  tipo_movimiento: string;

  @Column()
  id_usuario: string;

  @Column({ type: 'timestamp' })
  fecha_registro: Date;
}
