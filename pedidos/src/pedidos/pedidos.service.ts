import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { Repository } from 'typeorm';

interface IRespuestaApi2 {
  userId: number;
}

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>
  ) {}

  async findAll(): Promise<PedidoEntity[]>{
    return await this.pedidoRepository.find({relations: ["estado", "pago", "envio"]})
  }
}
