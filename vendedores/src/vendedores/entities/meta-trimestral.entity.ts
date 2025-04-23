import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PlanVentasEntity } from './plan-ventas.entity';
import { TrimestreEntity } from './trimestre.entity';

@Entity('meta_trimestral')
export class MetaTrimestralEntity {
  @PrimaryGeneratedColumn()
  idMeta: number;

  @ManyToOne(() => PlanVentasEntity, plan => plan.idPlan, { nullable: false })
  plan: PlanVentasEntity;

  @ManyToOne(() => TrimestreEntity, trimestre => trimestre.idQ, { nullable: false })
  @JoinColumn([
    { name: 'idQ', referencedColumnName: 'idQ' },
    { name: 'ano', referencedColumnName: 'ano' }
  ])
  trimestre: TrimestreEntity;

  @Column('float', { name: 'meta_venta' })
  metaVenta: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
}
