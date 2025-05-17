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

  async obtenerTodosLosClientesConUltimaVisita(): Promise<Array<{
    id_vendedor: string;
    clientes: Array<{
      id_cliente: string;
      id_vendedor: string;
      ultima_visita: Date | null;
      lat: number;
      lng: number;
    }>;
  }>> {
    const clientesConVisitas = await this.clienteRepository
      .createQueryBuilder('cliente')
      .select([
        'cliente.id_cliente as cliente_id_cliente',
        'cliente.id_vendedor as cliente_id_vendedor',
        'cliente.lat as cliente_lat',
        'cliente.lng as cliente_lng',
        'MAX(visita.fecha_visita) as ultima_visita',
      ])
      .leftJoin('cliente.visitas', 'visita')
      .where('cliente.id_vendedor IS NOT NULL')
      .groupBy('cliente.id_cliente')
      .addGroupBy('cliente.id_vendedor')
      .addGroupBy('cliente.lat')
      .addGroupBy('cliente.lng')
      .getRawMany();

    // Agrupar por vendedor y ordenar por última visita
    type ClienteRaw = {
      cliente_id_cliente: string;
      cliente_id_vendedor: string;
      cliente_lat: string;
      cliente_lng: string;
      ultima_visita: Date | null;
    };

    type ClienteTransformed = {
      id_cliente: string;
      id_vendedor: string;
      ultima_visita: Date | null;
      lat: number;
      lng: number;
    };

    // Primero agrupamos los clientes por vendedor con los datos raw
    const clientesPorVendedorRaw = (clientesConVisitas as ClienteRaw[]).reduce((acc, cliente) => {
      const vendedorId = cliente.cliente_id_vendedor;
      if (!acc[vendedorId]) {
        acc[vendedorId] = [];
      }
      acc[vendedorId].push(cliente);
      return acc;
    }, {} as { [id_vendedor: string]: ClienteRaw[] });

    // Luego transformamos los datos al formato final
    const clientesPorVendedor: { [id_vendedor: string]: ClienteTransformed[] } = {};

    // Transformar los campos a su formato final
    Object.keys(clientesPorVendedorRaw).forEach((vendedorId) => {
      clientesPorVendedor[vendedorId] = clientesPorVendedorRaw[vendedorId].map(cliente => ({
        id_cliente: cliente.cliente_id_cliente,
        id_vendedor: cliente.cliente_id_vendedor,
        ultima_visita: cliente.ultima_visita,
        lat: parseFloat(cliente.cliente_lat),
        lng: parseFloat(cliente.cliente_lng)
      }));
    });

    // Ordenar cada grupo por última visita
    Object.keys(clientesPorVendedor).forEach((vendedorId) => {
      clientesPorVendedor[vendedorId].sort((a, b) => {
        if (!a.ultima_visita) return 1;
        if (!b.ultima_visita) return -1;
        return (
          new Date(b.ultima_visita).getTime() -
          new Date(a.ultima_visita).getTime()
        );
      });
    });

    // Convertir el objeto a un array de vendedores
    return Object.entries(clientesPorVendedor).map(([id_vendedor, clientes]) => ({
      id_vendedor,
      clientes
    }));
  }
}
