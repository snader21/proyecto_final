import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoVendedorEntity } from './entities/estado-vendedor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosVendedoresService implements OnModuleInit {
  constructor(
    @InjectRepository(EstadoVendedorEntity)
    private readonly repository: Repository<EstadoVendedorEntity>,
  ) {}
  async onModuleInit() {
    await this.repository.save({
      id: 1,
      estado: 'Activo',
    });
    await this.repository.save({
      id: 2,
      estado: 'Inactivo',
    });
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
