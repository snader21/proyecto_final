import { RutaEntity } from 'src/rutas/entities/ruta.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nodoRuta')
export class NodoRutaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RutaEntity, (ruta) => ruta.nodosRutas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  ruta: RutaEntity;

  @Column()
  numeroNodoProgramado: number;

  @Column()
  numeroNodoFinal: number;

  @Column()
  latitud: number;

  @Column()
  longitud: number;

  @Column()
  horaLlegada: Date;

  @Column()
  horaSalida: Date;
}
