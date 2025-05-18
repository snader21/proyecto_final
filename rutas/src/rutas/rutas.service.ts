import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { DataSource, Repository } from 'typeorm';
import { NodosRutasService } from '../nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from '../tipos-rutas/tipos-rutas.service';
import { EstadosRutasService } from '../estados-rutas/estados-rutas.service';
import { CamionesService } from '../camiones/camiones.service';
import { TipoRutaEntity } from '../tipos-rutas/entities/tipo-ruta.entity';
import { EstadoRutaEntity } from '../estados-rutas/entities/estado-ruta.entity';
import { RutasVisitaVendedores } from './dto/rutas-visita-vendedores.dto';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(RutaEntity)
    private readonly rutaRepository: Repository<RutaEntity>,
    private readonly nodosRutasService: NodosRutasService,
    private readonly tiposRutasService: TiposRutasService,
    private readonly estadosRutasService: EstadosRutasService,
    private readonly camionesService: CamionesService,
    private readonly dataSource: DataSource,
  ) {}

  async createRutaDeVisitaVendedores(rutasVisita: RutasVisitaVendedores) {
    console.log(
      '🚀 ~ RutasService ~ createRutaDeVisitaVendedores ~ rutasVisita:',
      JSON.stringify(rutasVisita, null, 2),
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tipoRuta = (await this.tiposRutasService.findAll())?.find(
      (tipoRuta: TipoRutaEntity) => tipoRuta.tipo_ruta === 'Visita a cliente',
    );

    if (!tipoRuta) {
      throw new BadRequestException('Tipo de ruta Visita a cliente no encontrado');
    }

    const estadoRuta = (await this.estadosRutasService.findAll())?.find(
      (estadoRuta: EstadoRutaEntity) => estadoRuta.estado_ruta === 'Programada',
    );

    if (!estadoRuta) {
      throw new BadRequestException('Estado de ruta Programada no encontrado');
    }

    try {
      const savedRutas: RutaEntity[] = [];
      
      for (const vendedor of rutasVisita.vendedores) {
        for (const visita of vendedor.visitas_programadas) {
          // 1. Crear la ruta
          const rutaData: Partial<RutaEntity> = {
            fecha: visita.fecha,
            tipo_ruta: tipoRuta,
            duracion_estimada: visita.duracionEstimada,
            duracion_final: undefined,
            distancia_total: visita.distanciaTotal,
            camion: undefined,
            estado_ruta: estadoRuta,
            vendedor_id: parseInt(vendedor.id_vendedor),
            numero_ruta: 0,
          };

          const ruta = await queryRunner.manager.save(RutaEntity, rutaData);
          savedRutas.push(ruta);

          // 2. Crear los nodos
          if (visita.nodos?.length) {
            const nodosRuta = visita.nodos.map((nodo) => ({
              numeroNodoProgramado: nodo.numeroNodoProgramado,
              latitud: nodo.latitud,
              longitud: nodo.longitud,
              direccion: nodo.direccion || '',
              hora_llegada: nodo.hora_llegada,
              hora_salida: nodo.hora_salida,
              id_bodega: undefined,
              id_cliente: nodo.id_cliente,
              id_pedido: undefined,
              productos: [],
            }));

            await this.nodosRutasService.bulkCreateNodos(
              nodosRuta,
              ruta,
              queryRunner.manager,
            );
          }
        }
      }

      await queryRunner.commitTransaction();
      const rutas = await Promise.all(
        savedRutas.map((r) => this.findOne(r.id)),
      );
      return rutas.filter((r): r is RutaEntity => r !== null);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        error instanceof Error
          ? error.message
          : 'Error al crear las rutas de visita',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createRutaDeEntregaDePedidos(createRutaDto: CreateRutaDto[]) {
    console.log(
      '🚀 ~ RutasService ~ create ~ CreateRutaDto:',
      JSON.stringify(createRutaDto, null, 2),
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tipoRuta = (await this.tiposRutasService.findAll())?.find(
      (tipoRuta: TipoRutaEntity) => tipoRuta.tipo_ruta === 'Entrega de pedido',
    );

    const estadoRuta = (await this.estadosRutasService.findAll())?.find(
      (estadoRuta: EstadoRutaEntity) => estadoRuta.estado_ruta === 'Programada',
    );

    const fechas = [...new Set(createRutaDto.map((dto) => dto.fecha))];
    for (const fecha of fechas) {
      await queryRunner.manager.delete(RutaEntity, {
        fecha,
      });
    }

    try {
      const savedRutas: RutaEntity[] = [];
      for (const dto of createRutaDto) {
        const camion = await this.camionesService.findOne(dto.camionId);

        if (!camion) {
          throw new BadRequestException('Camion no encontrado');
        }

        const ruta = this.rutaRepository.create({
          fecha: dto.fecha,
          tipo_ruta: tipoRuta,
          duracion_estimada: dto.duracionEstimada,
          distancia_total: dto.distanciaTotal,
          camion,
          estado_ruta: estadoRuta,
        });

        const savedRuta = await queryRunner.manager.save(RutaEntity, ruta);
        savedRutas.push(savedRuta);
        if (dto.nodos?.length) {
          await this.nodosRutasService.bulkCreateNodos(
            dto.nodos,
            savedRuta,
            queryRunner.manager,
          );
        }
      }

      await queryRunner.commitTransaction();

      return Promise.all(savedRutas.map((r) => this.findOne(r.id)));
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create routes');
    } finally {
      await queryRunner.release();
    }
  }

  // cron every 5 seconds
  findAll() {
    return this.rutaRepository.find({
      relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas'],
    });
  }

  findOne(id: string) {
    return this.rutaRepository.findOne({
      where: { id },
      relations: ['nodos_rutas', 'nodos_rutas.productos'],
    });
  }

  update(id: number) {
    return `This action updates a #${id} ruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} ruta`;
  }
}
