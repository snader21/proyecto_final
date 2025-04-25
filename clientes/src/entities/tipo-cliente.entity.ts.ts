import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';

@Entity('tipo_cliente')
export class TipoCliente {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_cliente: string;

  @Column({ length: 50 })
  tipo_cliente: string;

  @OneToMany(() => Cliente, (cliente) => cliente.tipoCliente)
  clientes: Cliente[];
}
