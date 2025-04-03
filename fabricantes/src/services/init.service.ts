/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lugar } from '../entities/lugar.entity';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(Lugar)
    private readonly lugarRepository: Repository<Lugar>,
  ) {}

  async onModuleInit() {
    // Crear lugares (paises y ciudades)
    const lugares = [
      {
        nombre: 'España',
        tipo: 'Pais',
        ciudades: [
          { nombre: 'Madrid', tipo: 'Ciudad' },
          { nombre: 'Barcelona', tipo: 'Ciudad' },
          { nombre: 'Valencia', tipo: 'Ciudad' },
        ],
      },
      {
        nombre: 'México',
        tipo: 'Pais',
        ciudades: [
          { nombre: 'Ciudad de México', tipo: 'Ciudad' },
          { nombre: 'Guadalajara', tipo: 'Ciudad' },
          { nombre: 'Monterrey', tipo: 'Ciudad' },
        ],
      },
      // Agregar más paises y ciudades según sea necesario
    ];

    for (const lugar of lugares) {
      const existingLugar = await this.lugarRepository.findOne({
        where: { nombre: lugar.nombre, tipo: lugar.tipo },
      });

      let lugarCreado;
      if (!existingLugar) {
        lugarCreado = await this.lugarRepository.save(lugar);
      } else {
        lugarCreado = existingLugar;
      }

      // Insertar ciudades
      for (const ciudad of lugar.ciudades) {
        const existingCiudad = await this.lugarRepository.findOne({
          where: {
            nombre: ciudad.nombre,
            lugar_padre_id: lugarCreado.id,
          },
        });

        if (!existingCiudad) {
          await this.lugarRepository.save({
            ...ciudad,
            lugar_padre_id: lugarCreado.id,
          });
        }
      }
    }
  }
}
