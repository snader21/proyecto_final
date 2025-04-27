import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';

@Injectable()
export class MetodosEnvioService {
  constructor(
    @InjectRepository(MetodoEnvioEntity)
    private readonly metodoEnvioRepository: Repository<MetodoEnvioEntity>,
  ) {}

  async findAll(): Promise<MetodoEnvioEntity[]> {
    return this.metodoEnvioRepository.find();
  }
}
