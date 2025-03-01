import { RutaEntity } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipo_ruta')
export class TipoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo_ruta: string;

  @OneToMany(() => RutaEntity, (ruta) => ruta.tipo_ruta)
  rutas: RutaEntity[];
}
