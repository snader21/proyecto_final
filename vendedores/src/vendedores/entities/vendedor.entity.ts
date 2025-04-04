import { ZonaEntity } from '../../zonas/entities/zona.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vendedor')
export class VendedorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  usuario_id: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({
    unique: true,
    nullable: false,
  })
  correo: string;

  @Column({ nullable: false })
  telefono: string;

  @ManyToOne(() => ZonaEntity, (zona) => zona.vendedores)
  @JoinColumn({ name: 'zona_id' })
  zona: ZonaEntity;
}
