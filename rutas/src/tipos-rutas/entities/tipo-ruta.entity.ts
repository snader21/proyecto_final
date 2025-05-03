import { RutaEntity } from '../../rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_ruta')
export class TipoRutaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo_ruta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.tipo_ruta)
  rutas: RutaEntity[];
}
