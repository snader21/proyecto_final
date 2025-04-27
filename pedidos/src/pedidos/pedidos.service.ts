import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './entities/pedido.entity';
import { Repository } from 'typeorm';
import { EstadoPedidoEntity } from './entities/estado-pedido.entity';
import { MetodoPagoEntity } from './entities/metodo-pago.entity';
import { MetodoEnvioEntity } from './entities/metodo-envio.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PubSubService } from '../common/services/pubsub.service';

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
    private readonly pubSubService: PubSubService,
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

  async findAllMetodosPago() {
    return await this.metodoPagoRepository.find();
  }

  async create(createPedidoDto: CreatePedidoDto): Promise<PedidoEntity> {
    if (Array.isArray(createPedidoDto)) {
      throw new Error('Solo se permite crear un pedido a la vez');
    }
    // Si el DTO trae id_pedido, asignarlo explícitamente, sino dejar que TypeORM genere uno
    const pedido = this.pedidoRepository.create(createPedidoDto);
    if (createPedidoDto.id_pedido) {
      pedido.id_pedido = createPedidoDto.id_pedido;
    }
    const saved = await this.pedidoRepository.save(pedido);
    const found = await this.pedidoRepository.findOne({
      where: { id_pedido: saved.id_pedido },
      relations: ['estado', 'pago', 'envio'],
    });
    if (!found) throw new Error('Pedido no encontrado después de guardar');
    // Publicar mensaje al tópico para procesar el archivo
    try {
      await this.pubSubService.publishMessage(
        {
          idPedido: createPedidoDto.id_pedido,
        }
      );
    } catch (error) {
      console.log(error);      
    }
    
    return found;
  }

  async findByIdVendedor(idVendedor: string): Promise<PedidoEntity[]> {
    try {
      console.log('Buscando pedidos para vendedor:', idVendedor);
      const pedidos = await this.pedidoRepository.find({
        where: { id_vendedor: idVendedor },
        relations: ['estado', 'pago', 'envio'],
      });
      console.log('Pedidos encontrados:', pedidos);
      return pedidos;
    } catch (error) {
      console.error('Error al buscar pedidos:', error);
      throw error;
    }
  }
}
