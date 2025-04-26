import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('trimestre')
export class TrimestreEntity {
  @PrimaryColumn({ type: 'varchar', length: 2 })
  idQ: string; // Q1, Q2, Q3, Q4

  @PrimaryColumn({ type: 'int' })
  ano: number;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: Date;
}
