import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivo_producto')
export class ArchivoProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id_archivo: string;

  @Column()
  nombre_archivo: string;

  @Column()
  url: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @Column({ type: 'int', default: 0 })
  total_registros: number;

  @Column({ type: 'int', default: 0 })
  registros_cargados: number;

  @Column({ type: 'jsonb', nullable: true })
  errores_procesamiento: Array<{ row: any, error: string }>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_carga: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_procesamiento: Date;
}
