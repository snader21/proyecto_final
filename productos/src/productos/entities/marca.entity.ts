import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('marca')
export class MarcaEntity {
  @PrimaryGeneratedColumn('uuid')
  id_marca: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;
}