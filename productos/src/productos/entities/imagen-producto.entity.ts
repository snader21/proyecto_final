import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Entity('imagen_producto')
export class ImagenProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_imagen: string;

  @Column()
  key_object_storage: string;

  @Column()
  url: string;

  @ManyToOne(() => ProductoEntity)
  @JoinColumn({ name: 'id_producto' })
  producto: ProductoEntity;
}