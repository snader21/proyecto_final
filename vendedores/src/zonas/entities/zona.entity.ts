import { VendedorEntity } from '../../vendedores/entities/vendedor.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zona')
export class ZonaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => VendedorEntity, (vendedor) => vendedor.zona)
  vendedores: VendedorEntity[];
}
