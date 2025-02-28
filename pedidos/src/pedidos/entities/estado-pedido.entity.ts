import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('estado_pedido')
export class EstadoPedidoEntity {
  @PrimaryColumn()
  id_estado: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;
}