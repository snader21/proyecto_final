import { NodoProductoEntity } from '../../nodos-productos/entities/nodo-producto.entity';
import { RutaEntity } from '../../rutas/entities/ruta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('nodo_ruta')
export class NodoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RutaEntity, (ruta) => ruta.nodos_rutas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ruta_id' })
  ruta: RutaEntity;

  @OneToMany(() => NodoProductoEntity, (producto) => producto.nodo_ruta)
  productos: NodoProductoEntity[];

  @Column()
  numero_nodo_programado: number;

  @Column({
    nullable: true,
  })
  numero_nodo_final: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  latitud: number;

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  longitud: number;

  @Column()
  direccion: string;

  @Column({
    nullable: true,
  })
  id_cliente: string;

  @Column({
    nullable: true,
  })
  id_pedido: string;

  @Column({
    nullable: true,
  })
  id_bodega: string;

  @Column({ nullable: true })
  hora_llegada: Date;

  @Column({
    nullable: true,
  })
  hora_salida: Date;
}
