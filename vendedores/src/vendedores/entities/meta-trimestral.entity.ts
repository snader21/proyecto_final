import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanVentasEntity } from './plan-ventas.entity';
import { TrimestreEntity } from './trimestre.entity';

@Entity('meta_trimestral')
export class MetaTrimestralEntity {
  @PrimaryGeneratedColumn('uuid')
  idMeta: string;

  @Column({ name: 'id_plan' })
  idPlan: string;

  @Column({ length: 2 })
  idQ: string;

  @Column()
  ano: number;

  @Column('float', { name: 'meta_venta' })
  metaVenta: number;

  @ManyToOne(() => PlanVentasEntity, (plan) => plan.metas)
  @JoinColumn({ name: 'id_plan' })
  plan: PlanVentasEntity;

  @ManyToOne(() => TrimestreEntity)
  @JoinColumn([
    { name: 'idQ', referencedColumnName: 'idQ' },
    { name: 'ano', referencedColumnName: 'ano' },
  ])
  trimestre: TrimestreEntity;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
}
