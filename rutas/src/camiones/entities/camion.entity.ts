import { RutaEntity } from '../../rutas/entities/ruta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('camion')
export class CamionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  placa: string;

  @Column()
  nombre_conductor: string;

  @Column()
  celular_conductor: string;

  @Column()
  capacidad: number;

  @OneToMany(() => RutaEntity, (ruta) => ruta.camion)
  rutas: RutaEntity[];
}
