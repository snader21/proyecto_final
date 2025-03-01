import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('pais')
export class PaisEntity {
  @PrimaryGeneratedColumn('uuid')
  id_pais: string;

  @Column()
  nombre: string;

  @Column()
  abreviatura: string;

  @Column()
  moneda: string;

  @Column('double precision')
  iva: number;
}