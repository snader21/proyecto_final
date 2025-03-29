import { VendedorEntity } from '../../vendedores/entities/vendedor.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estado_vendedor')
export class EstadoVendedorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estado: string;

  @OneToMany(() => VendedorEntity, (vendedor) => vendedor.estado)
  vendedores: VendedorEntity[];
}
