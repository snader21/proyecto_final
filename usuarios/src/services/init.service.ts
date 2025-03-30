import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async onModuleInit() {
    const roles = [
      {
        nombre: 'Administrador',
        descripcion: 'Usuario con acceso total al sistema',
      },
      {
        nombre: 'Director de ventas',
        descripcion: 'Usuario con acceso a gestión de ventas',
      },
      {
        nombre: 'Director de compras',
        descripcion: 'Usuario con acceso a gestión de compras',
      },
      {
        nombre: 'Director de logistica',
        descripcion: 'Usuario con acceso a gestión de logística',
      },
      {
        nombre: 'Cliente',
        descripcion: 'Usuario con acceso básico al sistema',
      },
    ];

    for (const rol of roles) {
      const existingRol = await this.rolRepository.findOne({
        where: { nombre: rol.nombre },
      });

      if (!existingRol) {
        await this.rolRepository.save(rol);
      }
    }
  }
}
