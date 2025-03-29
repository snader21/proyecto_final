import { EstadoVendedorEntity } from '../../estados-vendedores/entities/estado-vendedor.entity';
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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  usuario_id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({
    unique: true,
    nullable: false,
  })
  correo: string;

  @Column({ nullable: false })
  telefono: string;

  @ManyToOne(() => EstadoVendedorEntity, (estado) => estado.vendedores)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoVendedorEntity;

  @ManyToOne(() => ZonaEntity, (zona) => zona.vendedores)
  @JoinColumn({ name: 'zona_id' })
  zona: ZonaEntity;
}
