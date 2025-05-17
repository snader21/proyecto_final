import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('visita_cliente')
export class VisitaCliente {
  @PrimaryGeneratedColumn('uuid')
  id_visita: string;

  @Column({ type: 'timestamp' })
  fecha_visita: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: false })
  realizo_pedido: boolean;

  @Column({ nullable: true })
  key_object_storage: string;

  @Column({ nullable: true })
  recomendacion: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.visitas)
  @JoinColumn({ name: 'id_cliente' })
  cliente: Cliente;

  @Column()
  id_cliente: string;
}
