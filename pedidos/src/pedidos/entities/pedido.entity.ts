import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EstadoPedidoEntity } from './estado-pedido.entity';
import { MetodoPagoEntity } from './metodo-pago.entity';
import { MetodoEnvioEntity } from './metodo-envio.entity';

@Entity('pedido')
export class PedidoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_pedido: string;

  @Column({ type: 'varchar', nullable: true })
  id_vendedor: string;

  @Column({ type: 'date' })
  fecha_registro: Date;

  @Column()
  id_estado: number;

  @ManyToOne(() => EstadoPedidoEntity)
  @JoinColumn({ name: 'id_estado' })
  estado: EstadoPedidoEntity;

  @Column()
  descripcion: string;

  @Column()
  id_cliente: string;

  @Column()
  id_metodo_pago: string;

  @ManyToOne(() => MetodoPagoEntity)
  @JoinColumn({ name: 'id_metodo_pago' })
  pago: MetodoPagoEntity;

  @Column()
  estado_pago: string;

  @Column('double precision')
  costo_envio: number;

  @Column()
  id_metodo_envio: string;

  @ManyToOne(() => MetodoEnvioEntity)
  @JoinColumn({ name: 'id_metodo_envio' })
  envio: MetodoEnvioEntity;
}
