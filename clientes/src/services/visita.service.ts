import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitaCliente } from '../entities/visita-cliente.entity';
import { CreateVisitaDto } from '../dto/create-visita.dto';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class VisitaService {
  constructor(
    @InjectRepository(VisitaCliente)
    private visitaRepository: Repository<VisitaCliente>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createVisitaDto: CreateVisitaDto): Promise<VisitaCliente> {
    // Verificar que el cliente existe
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: createVisitaDto.id_cliente },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${createVisitaDto.id_cliente} no encontrado`);
    }

    // Crear la nueva visita
    const visita = this.visitaRepository.create({
      ...createVisitaDto,
      cliente,
    });

    return this.visitaRepository.save(visita);
  }

  async findByCliente(id_cliente: string): Promise<VisitaCliente[]> {
    const visitas = await this.visitaRepository.find({
      where: { id_cliente },
      order: { fecha_visita: 'DESC' },
    });

    return visitas;
  }
}
