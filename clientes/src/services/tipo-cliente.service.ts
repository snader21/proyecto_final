/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';

@Injectable()
export class TipoClienteService {
  constructor(
    @InjectRepository(TipoCliente)
    private readonly tipoClienteRepository: Repository<TipoCliente>,
  ) {}

  /**
   * Busca y retorna todos los tipos de cliente.
   * @returns Una promesa que resuelve a un array de TipoCliente.
   */
  async findAll(): Promise<TipoCliente[]> {
    return this.tipoClienteRepository.find();
  }

  /**
   * Busca y retorna un tipo de cliente por su ID.
   * Lanza una NotFoundException si el tipo de cliente no es encontrado.
   * @param id El ID del tipo de cliente a buscar.
   * @returns Una promesa que resuelve al TipoCliente encontrado.
   */
  async findOne(id: string): Promise<TipoCliente> {
    const tipoCliente = await this.tipoClienteRepository.findOne({
      where: { id_tipo_cliente: id },
    });
    if (!tipoCliente) {
      throw new NotFoundException(`Tipo de cliente con ID ${id} no encontrado`);
    }
    return tipoCliente;
  }
}
