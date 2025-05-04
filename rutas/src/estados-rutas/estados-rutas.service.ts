import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateEstadoRutaDto } from './dto/create-estado-ruta.dto';
import { UpdateEstadoRutaDto } from './dto/update-estado-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoRutaEntity } from './entities/estado-ruta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosRutasService implements OnModuleInit {
  constructor(
    @InjectRepository(EstadoRutaEntity)
    private readonly estadoRutaRepository: Repository<EstadoRutaEntity>,
  ) {}
  async onModuleInit() {
    await this.estadoRutaRepository.save({
      estado_ruta: 'Programada',
    });
    await this.estadoRutaRepository.save({
      estado_ruta: 'En curso',
    });
    await this.estadoRutaRepository.save({
      estado_ruta: 'Finalizada',
    });
  }
  create(createEstadosRutaDto: CreateEstadoRutaDto) {
    return 'This action adds a new estadosRuta';
  }

  findAll(): Promise<EstadoRutaEntity[]> {
    return this.estadoRutaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} estadosRuta`;
  }

  update(id: number, updateEstadosRutaDto: UpdateEstadoRutaDto) {
    return `This action updates a #${id} estadosRuta`;
  }

  remove(id: number) {
    return `This action removes a #${id} estadosRuta`;
  }
}
