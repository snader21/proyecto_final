import { Injectable, OnModuleInit } from '@nestjs/common';
import { ZonaEntity } from './entities/zona.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ZonasService implements OnModuleInit {
  constructor(
    @InjectRepository(ZonaEntity)
    private readonly repository: Repository<ZonaEntity>,
  ) {}

  async onModuleInit() {
    for (let i = 1; i <= 5; i++) {
      await this.repository.save({
        id: i,
        nombre: `Zona ${i}`,
        descripcion: `Zona ${i}`,
      });
    }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
