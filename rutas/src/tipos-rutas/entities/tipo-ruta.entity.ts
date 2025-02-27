import { RutaEntity } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipoRuta')
export class TipoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipoRuta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.tipoRuta)
  rutas: RutaEntity[];
}
