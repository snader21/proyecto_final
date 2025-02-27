import { RutaEntity } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estadoRuta')
export class EstadoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estadoRuta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.estadoRuta)
  rutas: RutaEntity[];
}
