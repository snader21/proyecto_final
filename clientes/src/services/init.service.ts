/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';

@Injectable()
export class TipoClienteInitService implements OnModuleInit {
  constructor(
    @InjectRepository(TipoCliente)
    private readonly tipoClienteRepository: Repository<TipoCliente>,
  ) {}

  async onModuleInit() {
    const tiposDeCliente = [
      { tipo_cliente: 'Individual' },
      { tipo_cliente: 'Empresa Pequeña' },
      { tipo_cliente: 'Empresa Mediana' },
      { tipo_cliente: 'Empresa Grande' },
      { tipo_cliente: 'Distribuidor' },
      // Agregar más tipos de cliente según necesidades
    ];

    console.log('Iniciando inicialización de tipos de cliente...');

    for (const tipo of tiposDeCliente) {
      const existingTipo = await this.tipoClienteRepository.findOne({
        where: { tipo_cliente: tipo.tipo_cliente },
      });
      if (!existingTipo) {
        await this.tipoClienteRepository.save(tipo);
        console.log(`Tipo de cliente "${tipo.tipo_cliente}" creado.`);
      } else {
        console.log(`Tipo de cliente "${tipo.tipo_cliente}" ya existe.`);
      }
    }
    console.log('Inicialización de tipos de cliente completada.');
  }
}
