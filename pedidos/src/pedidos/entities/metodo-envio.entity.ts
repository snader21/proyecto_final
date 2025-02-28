import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('metodo_envio')
export class MetodoEnvioEntity {
  @PrimaryColumn()
  id_metodo_envio: string;

  @Column()
  nombre: string;
}