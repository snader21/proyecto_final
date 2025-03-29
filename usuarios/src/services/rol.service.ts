import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { id } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }

  async findByName(nombre: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { nombre } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }
}
