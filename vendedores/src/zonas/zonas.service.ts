import { Injectable, OnModuleInit } from '@nestjs/common';
import { ZonaEntity } from './entities/zona.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ZonasService implements OnModuleInit {
  constructor(
    @InjectRepository(ZonaEntity)
    private readonly repository: Repository<ZonaEntity>,
  ) {}

  async onModuleInit() {
    const uuidv4 = 'dbbc9d28-da65-4d92-8969-76c376c31521';
    for (let i = 1; i <= 5; i++) {
      await this.repository.save({
        id: uuidv4.slice(0, -1) + i,
        nombre: `Zona ${i}`,
        descripcion: `Zona ${i}`,
      });
    }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
