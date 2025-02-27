import { Injectable } from '@nestjs/common';
import { CreateCamionDto } from './dto/create-camion.dto';
import { UpdateCamionDto } from './dto/update-camion.dto';

@Injectable()
export class CamionesService {
  create(createCamioneDto: CreateCamionDto) {
    return 'This action adds a new camione';
  }

  findAll() {
    return `This action returns all camiones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} camione`;
  }

  update(id: number, updateCamioneDto: UpdateCamionDto) {
    return `This action updates a #${id} camione`;
  }

  remove(id: number) {
    return `This action removes a #${id} camione`;
  }
}
