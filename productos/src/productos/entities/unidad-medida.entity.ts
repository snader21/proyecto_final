import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('unidad_medida')
export class UnidadMedidaEntity {
  @PrimaryGeneratedColumn('uuid')
  id_unidad_medida: string;

  @Column()
  nombre: string;

  @Column()
  abreviatura: string;
}