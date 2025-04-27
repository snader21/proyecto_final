import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VendedorEntity } from './vendedor.entity';
import { MetaTrimestralEntity } from './meta-trimestral.entity';

@Entity('plan_ventas')
export class PlanVentasEntity {
  @PrimaryGeneratedColumn('uuid')
  idPlan: string;

  @Column({ name: 'id_vendedor' })
  idVendedor: string;

  @Column()
  ano: number;

  @ManyToOne(() => VendedorEntity)
  @JoinColumn({ name: 'id_vendedor' })
  vendedor: VendedorEntity;

  @OneToMany(() => MetaTrimestralEntity, (meta) => meta.plan)
  metas: MetaTrimestralEntity[];

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
}
