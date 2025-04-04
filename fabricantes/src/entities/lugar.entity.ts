import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('lugares')
export class Lugar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column({ nullable: true })
  lugar_padre_id: string;

  @ManyToOne(() => Lugar, (lugar) => lugar.lugares)
  @JoinColumn({ name: 'lugar_padre_id' })
  lugar_padre: Lugar;

  @OneToMany(() => Lugar, (lugar) => lugar.lugar_padre)
  lugares: Lugar[];
}
