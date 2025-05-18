import { CamionEntity } from '../../camiones/entities/camion.entity';
import { EstadoRutaEntity } from '../../estados-rutas/entities/estado-ruta.entity';
import { NodoRutaEntity } from '../../nodos-rutas/entities/nodo-ruta.entity';
import { TipoRutaEntity } from '../../tipos-rutas/entities/tipo-ruta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ruta')
export class RutaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', generated: 'increment', unique: true })
  numero_ruta: number;

  @Column({ type: 'date' })
  fecha: string;

  @ManyToOne(() => TipoRutaEntity, (tipo_ruta) => tipo_ruta.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'tipo_ruta_id' })
  tipo_ruta: TipoRutaEntity;

  @Column()
  duracion_estimada: number;

  @Column({
    nullable: true,
  })
  duracion_final: number;

  @Column({ type: 'float' })
  distancia_total: number;

  @ManyToOne(() => CamionEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'camion_id' })
  camion: CamionEntity | null;

  @Column({ type: 'uuid', nullable: true })
  vendedor_id: string | null;

  @ManyToOne(() => EstadoRutaEntity, { eager: true })
  @JoinColumn({ name: 'estado_ruta_id' })
  estado_ruta: EstadoRutaEntity;

  @OneToMany(() => NodoRutaEntity, (nodo) => nodo.ruta, { eager: true })
  nodos_rutas: NodoRutaEntity[];
}
