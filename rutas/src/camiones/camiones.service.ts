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
    const numCamiones = 10;
    for (let i = 0; i < numCamiones; i++) {
      await this.camionRepository.save({
        placa: `AAA${(i + 1).toString().padStart(3, '0')}`,
        nombre_conductor: `Conductor${i + 1}`,
        celular_conductor: `32056667${(i + 1).toString().padStart(2, '0')}`,
        capacidad: 100000,
      });
    }
  }
  create(createCamioneDto: CreateCamionDto) {
    return 'This action adds a new camione';
  }

  findAll() {
    return this.camionRepository.find();
  }

  findOne(id: string) {
    return this.camionRepository.findOne({ where: { id } });
  }

  update(id: number, updateCamioneDto: UpdateCamionDto) {
    return `This action updates a #${id} camione`;
  }

  remove(id: number) {
    return `This action removes a #${id} camione`;
  }
}
