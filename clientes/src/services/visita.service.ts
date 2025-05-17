/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitaCliente } from '../entities/visita-cliente.entity';
import { CreateVisitaDto } from '../dto/create-visita.dto';
import { Cliente } from '../entities/cliente.entity';
import { Storage } from '@google-cloud/storage';
import { GCPConfigService } from './gcp-config.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from '@google-cloud/pubsub';



@Injectable()
export class VisitaService {
  private readonly storage;
  private readonly bucketName;
  private readonly pubSub: PubSub;
  private readonly topicName: string;
  constructor(
    @InjectRepository(VisitaCliente)
    private readonly visitaRepository: Repository<VisitaCliente>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly gcpConfigService: GCPConfigService,
    private readonly configService: ConfigService,
  ) {
    //Inicializar storage
    this.storage = new Storage(this.gcpConfigService.getCredentials());
    this.bucketName =
      this.configService.get<string>('GCP_BUCKET_NAME') ||
      'proyecto-final-ccp-bucket';
    //Inicializar pubsub
    this.pubSub = new PubSub(this.gcpConfigService.getCredentials());
    this.topicName =
      this.configService.get<string>('GCP_PUBSUB_TOPIC') || 'recomendaciones';
  }

  async create(
    createVisitaDto: CreateVisitaDto,
    file: Express.Multer.File,
  ): Promise<VisitaCliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: createVisitaDto.id_cliente },
    });

    if (!cliente) {
      throw new NotFoundException(
        `Cliente con ID ${createVisitaDto.id_cliente} no encontrado`,
      );
    }

    if (file) {
      const extension = file.originalname.split('.').pop();
      const name = file.originalname.replace(/\.[^/.]+$/, '');
      const uniqueId = uuidv4();
      file.originalname = `${name}-${uniqueId}.${extension}`;
      await this.uploadToGCP(file);
    }

    const visita = this.visitaRepository.create({
      ...createVisitaDto,
      key_object_storage: file?.originalname,
      cliente,
    });

    const visitaGuardada = await this.visitaRepository.save(visita);

    // Enviar al topico
    await this.publishToTopic({
      tipo: 'nueva_visita',
      id_visita: visitaGuardada.id_visita,
      archivo: visitaGuardada.key_object_storage || null,
    });

    return visitaGuardada;
  }

  async uploadToGCP(file: Express.Multer.File): Promise<string> {
    const fileName = file.originalname;
    const bucket = this.storage.bucket(this.bucketName);
    const blob = bucket.file(`videos/${fileName}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', reject);
      blobStream.on('finish', resolve);
      blobStream.end(file.buffer);
    });
  }

  async getUrl(fileName: string): Promise<any> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(`videos/${fileName}`);
      const [exists] = await file.exists();
      if (!exists) {
        throw new Error(`File ${fileName} not found`);
      }
      const [url]: string = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutos
      });
      return { url };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async publishToTopic(message: Record<string, any>): Promise<string> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(message));
      const messageId = await this.pubSub
        .topic(this.topicName)
        .publish(dataBuffer);
      return messageId;
    } catch (error) {
      console.error('Error publicando en el tópico:', error);
      throw error;
    }
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
