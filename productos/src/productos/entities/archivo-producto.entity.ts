import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivo_producto')
export class ArchivoProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_archivo: string;

  @Column()
  nombre_archivo: string;

  @Column()
  url: string;

  @Column()
  estado: string; // pendiente, procesado, error

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  fecha_carga: Date;
}
