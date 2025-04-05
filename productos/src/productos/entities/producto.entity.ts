import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { MarcaEntity } from './marca.entity';
import { UnidadMedidaEntity } from './unidad-medida.entity';
import { PaisEntity } from './pais.entity';
import { ImagenProductoEntity } from './imagen-producto.entity';
import { MovimientoInventarioEntity } from '../../movimientos-inventario/entities/movimiento-inventario.entity';

@Entity('producto')
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_producto: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column({ unique: true })
  @Index('IDX_PRODUCTO_SKU', { unique: true })
  sku: string;

  @Column({ nullable: true })
  codigo_barras?: string;

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

  @Column({ type: 'date' })
  fecha_creacion: Date;

  @Column({ type: 'date' })
  fecha_actualizacion: Date;

  @Column()
  id_fabricante: string;

  @ManyToOne(() => PaisEntity)
  @JoinColumn({ name: 'id_pais' })
  pais: PaisEntity;

  @OneToMany(
    () => MovimientoInventarioEntity,
    (movimiento_inventario) => movimiento_inventario.producto,
  )
  movimientos_inventario: MovimientoInventarioEntity[];

  @OneToMany(() => ImagenProductoEntity, (imagen) => imagen.producto)
  imagenes: ImagenProductoEntity[];
}
