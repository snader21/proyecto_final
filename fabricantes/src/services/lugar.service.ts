import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lugar } from '../entities/lugar.entity';

@Injectable()
export class LugarService {
  constructor(
    @InjectRepository(Lugar)
    private readonly lugarRepository: Repository<Lugar>,
  ) {}

  async findAllLugares(): Promise<Lugar[]> {
    return this.lugarRepository.find();
  }

  async findLugaresByTipo(tipo: string): Promise<Lugar[]> {
    return this.lugarRepository.find({ where: { tipo } });
  }

  async findLugaresByTipoCiudadAndPais(id: string): Promise<Lugar[]> {
    return this.lugarRepository.find({
      where: { tipo: 'Ciudad', lugar_padre_id: id },
    });
  }

  async findLugarById(id: string): Promise<Lugar> {
    const lugar = await this.lugarRepository.findOne({ where: { id } });
    if (!lugar) {
      throw new NotFoundException('Lugar no encontrado');
    }
    return lugar;
  }
}
