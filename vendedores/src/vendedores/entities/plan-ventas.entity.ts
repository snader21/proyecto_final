import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VendedorEntity } from './vendedor.entity';

@Entity('plan_ventas')
export class PlanVentasEntity {
  @PrimaryGeneratedColumn()
  idPlan: number;

  @ManyToOne(() => VendedorEntity, vendedor => vendedor.id, { nullable: false })
  vendedor: VendedorEntity;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;
}
