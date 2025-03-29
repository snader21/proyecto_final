import { NodoRutaEntity } from '../../nodos-rutas/entities/nodo-ruta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('nodo_producto')
export class NodoProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NodoRutaEntity, (nodo_ruta) => nodo_ruta.productos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nodo_ruta_id' })
  nodo_ruta: NodoRutaEntity;

  @Column()
  producto_id: string;

  @Column()
  pedido_id: string;
}
