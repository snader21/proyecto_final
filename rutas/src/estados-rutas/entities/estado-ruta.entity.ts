import { RutaEntity } from '../../rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado_ruta')
export class EstadoRutaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  estado_ruta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.estado_ruta)
  rutas: RutaEntity[];
}
