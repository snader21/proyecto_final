import { Injectable } from '@nestjs/common';
import { CreateTipoRutaDto } from './dto/create-tipo-ruta.dto';
import { UpdateTipoRutaDto } from './dto/update-tipo-ruta.dto';

@Injectable()
export class TiposRutasService {
  create(createTiposRutaDto: CreateTipoRutaDto) {
    return 'This action adds a new tiposRuta';
  }

  findAll() {
    return `This action returns all tiposRutas`;
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
