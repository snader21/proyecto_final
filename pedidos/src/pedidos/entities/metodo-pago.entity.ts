import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('metodo_pago')
export class MetodoPagoEntity {
  @PrimaryColumn()
  id_metodo_pago: string;

  @Column()
  nombre: string;
}