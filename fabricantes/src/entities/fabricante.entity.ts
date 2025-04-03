import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Lugar } from './lugar.entity';

@Entity('fabricantes')
export class Fabricante {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  direccion: string;

  @Column()
  estado: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_utima_modificacion: Date;

  @Column()
  telefono: string;

  @Column()
  lugar_id: string; // Asumiendo que es una relación con la entidad Lugar

  @ManyToOne(() => Lugar, (lugar) => lugar.id)
  @JoinColumn({ name: 'lugar_id' })
  lugar: Lugar;
}
