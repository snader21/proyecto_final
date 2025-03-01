import { RutaEntity } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado_ruta')
export class EstadoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estado_ruta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.estado_ruta)
  rutas: RutaEntity[];
}
