import { Injectable } from '@nestjs/common';
import { CreateNodoRutaDto } from './dto/create-nodo-ruta.dto';
import { UpdateNodoRutaDto } from './dto/update-nodo-ruta.dto';

@Injectable()
export class NodosRutasService {
  create(createNodosRutaDto: CreateNodoRutaDto) {
    return 'This action adds a new nodosRuta';
  }

  findAll() {
    return `This action returns all nodosRutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nodosRuta`;
  }

  update(id: number, updateNodosRutaDto: UpdateNodoRutaDto) {
    return `This action updates a #${id} nodosRuta`;
  }

  remove(id: number) {
    return `This action removes a #${id} nodosRuta`;
  }
}
