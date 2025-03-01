import { NodoRutaEntity } from 'src/nodos-rutas/entities/nodo-ruta.entity';
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
  producto_id: number;

  @Column()
  pedido_id: number;
}
