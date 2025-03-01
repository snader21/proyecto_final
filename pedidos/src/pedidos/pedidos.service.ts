import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';

@Injectable()
export class PedidosService implements OnModuleInit {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(EstadoPedidoEntity)
    private readonly estadoPedidoRepository: Repository<EstadoPedidoEntity>,
    @InjectRepository(MetodoPagoEntity)
    private readonly metodoPagoRepository: Repository<MetodoPagoEntity>,
    @InjectRepository(MetodoEnvioEntity)
    private readonly metodoEnvioRepository: Repository<MetodoEnvioEntity>,
  ) {}

  async onModuleInit() {
    await this.estadoPedidoRepository.insert([
      {
        id_estado: 1,
        nombre: 'Pendiente',
        descripcion: 'El pedido ha sido creado pero aún no aprobado',
      },
      {
        id_estado: 2,
        nombre: 'Aprobado',
        descripcion: 'El pedido ha sido validado y está listo',
      },
      {
        id_estado: 3,
        nombre: 'Enviado',
        descripcion: 'El pedido ya fue despachado al cliente',
      },
      {
        id_estado: 4,
        nombre: 'Entregado',
        descripcion: 'El pedido llegó al cliente',
      },
      {
        id_estado: 5,
        nombre: 'Cancelado',
        descripcion: 'El pedido fue cancelado por algún motivo',
      },
      {
        id_estado: 6,
        nombre: 'Devuelto',
        descripcion: 'El cliente devolvió el pedido',
      },
    ]);

    // Insert métodos de pago
    await this.metodoPagoRepository.insert([
      { id_metodo_pago: 'MP001', nombre: 'Tarjeta de Crédito' },
      { id_metodo_pago: 'MP002', nombre: 'PayPal' },
      { id_metodo_pago: 'MP003', nombre: 'Transferencia Bancaria' },
    ]);

    // Insert métodos de envío
    await this.metodoEnvioRepository.insert([
      { id_metodo_envio: 'ME001', nombre: 'Envío Estándar' },
      { id_metodo_envio: 'ME002', nombre: 'Envío Express' },
      { id_metodo_envio: 'ME003', nombre: 'Recogida en Tienda' },
    ]);

    // Insert pedidos
    await this.pedidoRepository.insert([
      {
        id_pedido: 'fde84552-ec7d-43e6-9d15-20a693dcf50f',
        id_vendedor: 'V001',
        fecha_registro: new Date('2025-02-27'),
        id_estado: 1,
        descripcion: 'Pedido de prueba 1',
        id_cliente: 'C001',
        id_metodo_pago: 'MP001',
        estado_pago: 'Pagado',
        costo_envio: 5.0,
        id_metodo_envio: 'ME001',
      },
      {
        id_pedido: 'fde84552-ec7d-43e6-9d15-20a693dcf50e',
        id_vendedor: 'V002',
        fecha_registro: new Date('2025-02-26'),
        id_estado: 2,
        descripcion: 'Pedido de prueba 2',
        id_cliente: 'C002',
        id_metodo_pago: 'MP002',
        estado_pago: 'Pendiente',
        costo_envio: 10.0,
        id_metodo_envio: 'ME002',
      },
    ]);
  }

  async findAll(): Promise<PedidoEntity[]> {
    return await this.pedidoRepository.find({
      relations: ['estado', 'pago', 'envio'],
    });
  }
}
