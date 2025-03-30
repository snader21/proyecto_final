import { RutaEntity } from '../../rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('camion')
export class CamionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  placa: string;

  @Column()
  anio: number;

  @Column()
  nombre_conductor: string;

  @Column()
  capacidad: number;

  @OneToMany(() => RutaEntity, (ruta) => ruta.camion)
  rutas: RutaEntity[];
}
