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

  @Column({ type: 'integer', default: 0 })
  total_registros: number;

  @Column({ type: 'integer', default: 0 })
  registros_cargados: number;

  @Column({ type: 'jsonb', nullable: true })
  errores_procesamiento: Array<{row: any, error: string}>;
}
