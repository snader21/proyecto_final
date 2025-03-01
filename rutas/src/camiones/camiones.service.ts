import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCamionDto } from './dto/create-camion.dto';
import { UpdateCamionDto } from './dto/update-camion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CamionEntity } from './entities/camion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CamionesService implements OnModuleInit {
  constructor(
    @InjectRepository(CamionEntity)
    private readonly camionRepository: Repository<CamionEntity>,
  ) {}
  async onModuleInit() {
    await this.camionRepository.save({
      id: 1,
      placa: 'AAA111',
      anio: 1980,
      nombre_conductor: 'Juan Perez',
      capacidad: 10000,
    });
  }
  create(createCamioneDto: CreateCamionDto) {
    return 'This action adds a new camione';
  }

  findAll() {
    return this.camionRepository.find();
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
