import { Injectable } from '@nestjs/common';
import { CreateEstadoRutaDto } from './dto/create-estado-ruta.dto';
import { UpdateEstadoRutaDto } from './dto/update-estado-ruta.dto';

@Injectable()
export class EstadosRutasService {
  create(createEstadosRutaDto: CreateEstadoRutaDto) {
    return 'This action adds a new estadosRuta';
  }

  findAll() {
    return `This action returns all estadosRutas`;
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
