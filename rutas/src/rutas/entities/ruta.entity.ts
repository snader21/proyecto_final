import { CamionEntity } from 'src/camiones/entities/camion.entity';
import { EstadoRutaEntity } from 'src/estados-rutas/entities/estado-ruta.entity';
import { NodoRutaEntity } from 'src/nodos-rutas/entities/nodo-ruta.entity';
import { TipoRutaEntity } from 'src/tipos-rutas/entities/tipo-ruta.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

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

  @Column()
  distancia_total: number;

  @ManyToOne(() => CamionEntity, (camion) => camion.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'camion_id' })
  camion: CamionEntity;

  @Column({
    nullable: true,
  })
  vendedor_id: number;

  @ManyToOne(() => EstadoRutaEntity, (estado_ruta) => estado_ruta.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'estado_ruta_id' })
  estado_ruta: EstadoRutaEntity;

  @OneToMany(() => NodoRutaEntity, (nodo_ruta) => nodo_ruta.ruta)
  nodos_rutas: NodoRutaEntity[];
}
