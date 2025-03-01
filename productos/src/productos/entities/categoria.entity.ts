import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('categoria')
export class CategoriaEntity {
  @PrimaryGeneratedColumn('uuid')
  id_categoria: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.categoria_padre, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_categoria_padre' })
  categoria_padre: CategoriaEntity;
}
