import { CamionEntity } from 'src/camiones/entities/camion.entity';
import { EstadoRutaEntity } from 'src/estados-rutas/entities/estado-ruta.entity';
import { NodoRutaEntity } from 'src/nodos-rutas/entities/nodo-ruta.entity';
import { TipoRutaEntity } from 'src/tipos-rutas/entities/tipo-ruta.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ruta')
export class RutaEntity {
  @PrimaryGeneratedColumn()
  idRuta: number;

  @Column()
  fecha: Date;

  @ManyToOne(() => TipoRutaEntity, (tipoRuta) => tipoRuta.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  tipoRuta: TipoRutaEntity;

  @Column()
  duracionEstimada: number;

  @Column()
  duracionFinal: number;

  @Column()
  distanciaTotal: number;

  @ManyToOne(() => CamionEntity, (camion) => camion.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  camion: CamionEntity;

  @Column()
  vendedorId: number;

  @ManyToOne(() => EstadoRutaEntity, (estadoRuta) => estadoRuta.rutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  estadoRuta: EstadoRutaEntity;

  @OneToMany(() => NodoRutaEntity, (nodoRuta) => nodoRuta.ruta)
  nodosRutas: NodoRutaEntity[];
}
