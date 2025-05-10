import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BodegaEntity } from './entities/bodega.entity';

@Injectable()
export class BodegasService {
  constructor(
    @InjectRepository(BodegaEntity)
    private readonly bodegaRepository: Repository<BodegaEntity>,
  ) {}

  async getBodega(id: string): Promise<BodegaEntity> {
    const bodega = await this.bodegaRepository.findOne({
      where: { id_bodega: id },
    });
    if (!bodega) {
      throw new NotFoundException('Bodega no encontrada');
    }
    return bodega;
  }
}
