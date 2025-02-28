import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { MarcaEntity } from './marca.entity';
import { UnidadMedidaEntity } from './unidad-medida.entity';
import { PaisEntity } from './pais.entity';

@Entity('producto')
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_producto: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  sku: string;

  @Column()
  codigo_barras: string;

  @ManyToOne(() => CategoriaEntity)
  @JoinColumn({ name: 'id_categoria' })
  categoria: CategoriaEntity;

  @ManyToOne(() => MarcaEntity)
  @JoinColumn({ name: 'id_marca' })
  marca: MarcaEntity;

  @ManyToOne(() => UnidadMedidaEntity)
  @JoinColumn({ name: 'id_unidad_medida' })
  unidad_medida: UnidadMedidaEntity;

  @Column('double precision')
  precio: number;

  @Column()
  activo: boolean;

  @Column('double precision')
  alto: number;

  @Column('double precision')
  ancho: number;

  @Column('double precision')
  largo: number;

  @Column('double precision')
  peso: number;

  @Column({ type: 'timestamp' })
  fecha_creacion: Date;

  @Column({ type: 'timestamp' })
  fecha_actualizacion: Date;

  @Column()
  id_fabricante: string;

  @ManyToOne(() => PaisEntity)
  @JoinColumn({ name: 'id_pais' })
  pais: PaisEntity;
}
