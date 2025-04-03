import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UbicacionEntity } from './entities/ubicacion.entity';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(UbicacionEntity)
    private readonly repositorio: Repository<UbicacionEntity>,
  ) {}

  async obtenerUbicacion(id: string): Promise<UbicacionEntity> {
    const ubicacion = await this.repositorio.findOne({
      where: { id_ubicacion: id },
    });
    if (!ubicacion) {
      throw new NotFoundException('Ubicación no encontrada');
    }
    return ubicacion;
  }
}
