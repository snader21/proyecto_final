import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTipoRutaDto } from './dto/create-tipo-ruta.dto';
import { UpdateTipoRutaDto } from './dto/update-tipo-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoRutaEntity } from './entities/tipo-ruta.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TiposRutasService implements OnModuleInit {
  constructor(
    @InjectRepository(TipoRutaEntity)
    private readonly tipoRutaRepository: Repository<TipoRutaEntity>,
  ) {}

  async onModuleInit() {
    await this.tipoRutaRepository.save({
      tipo_ruta: 'Entrega de pedido',
    });
    await this.tipoRutaRepository.save({
      tipo_ruta: 'Visita a cliente',
    });
  }

  create(createTiposRutaDto: CreateTipoRutaDto) {
    return 'This action adds a new tiposRuta';
  }

  findAll(): Promise<TipoRutaEntity[]> {
    return this.tipoRutaRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} tiposRuta`;
  }

  update(id: number, updateTiposRutaDto: UpdateTipoRutaDto) {
    return `This action updates a #${id} tiposRuta`;
  }

  remove(id: number) {
    return `This action removes a #${id} tiposRuta`;
  }
}
