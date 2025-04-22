import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoCliente } from './tipo-cliente.entity.ts';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id_cliente: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ nullable: true })
  id_tipo_cliente: string;

  @ManyToOne(() => TipoCliente, (tipoCliente) => tipoCliente.clientes)
  @JoinColumn({ name: 'id_tipo_cliente' })
  tipoCliente: TipoCliente;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 50, nullable: true })
  pais: string;

  @Column({ length: 50, nullable: true })
  ciudad: string;

  @Column({ length: 50, nullable: true, unique: true })
  documento_identidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;
}
