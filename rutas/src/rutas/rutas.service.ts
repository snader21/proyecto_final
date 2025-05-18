import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { NodosRutasService } from '../nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from '../tipos-rutas/tipos-rutas.service';
import { EstadosRutasService } from '../estados-rutas/estados-rutas.service';
import { CamionesService } from '../camiones/camiones.service';
import { TipoRutaEntity } from '../tipos-rutas/entities/tipo-ruta.entity';
import { EstadoRutaEntity } from '../estados-rutas/entities/estado-ruta.entity';
import { CamionEntity } from '../camiones/entities/camion.entity';
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

  async createRutaDeEntregaDePedidos(createRutaDto: CreateRutaDto[]) {
    return this.createRutas(createRutaDto, 'Entrega de pedido', true);
  }

  async createRutaDeVisitaVendedores(rutasVisita: RutasVisitaVendedores | CreateRutaDto[]) {
    if (Array.isArray(rutasVisita)) {
      return this.createRutas(rutasVisita, 'Visita a cliente', false);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
            vendedor_id: vendedor.id_vendedor,
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
              direccion: nodo.direccion || `${nodo.latitud}, ${nodo.longitud}`,
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

  private async createRutas(
    createRutaDto: CreateRutaDto[],
    tipoRutaNombre: string,
    requiresCamion: boolean,
  ): Promise<RutaEntity[]> {
    console.log(
      '🚀 ~ RutasService ~ create ~ CreateRutaDto:',
      JSON.stringify(createRutaDto, null, 2),
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener tipo de ruta
      const tipoRuta = (await this.tiposRutasService.findAll())?.find(
        (tipoRuta: TipoRutaEntity) => tipoRuta.tipo_ruta === tipoRutaNombre,
      );

      if (!tipoRuta) {
        throw new BadRequestException(`Tipo de ruta ${tipoRutaNombre} no encontrado`);
      }

      // 2. Obtener estado inicial
      const estadoRuta = (await this.estadosRutasService.findAll())?.find(
        (estadoRuta: EstadoRutaEntity) => estadoRuta.estado_ruta === 'Programada',
      );

      if (!estadoRuta) {
        throw new BadRequestException('Estado de ruta Programada no encontrado');
      }

      // 3. Eliminar rutas existentes para las fechas
      const fechas = [...new Set(createRutaDto.map((dto) => dto.fecha))];
      for (const fecha of fechas) {
        await queryRunner.manager.delete(RutaEntity, {
          fecha,
          tipo_ruta: { id: tipoRuta.id },
        });
      }

      // 4. Crear nuevas rutas
      const savedRutas: RutaEntity[] = [];
      for (const dto of createRutaDto) {
        // 4.1 Obtener camión si es necesario
        let camion: CamionEntity | null = null;
        if (requiresCamion && dto.camionId) {
          camion = await this.camionesService.findOne(dto.camionId);
          if (!camion) {
            throw new BadRequestException(`Camión ${dto.camionId} no encontrado`);
          }
        }

        // 4.2 Crear ruta
        const rutaData: DeepPartial<RutaEntity> = {
          fecha: dto.fecha,
          tipo_ruta: tipoRuta,
          duracion_estimada: dto.duracionEstimada,
          duracion_final: undefined,
          distancia_total: dto.distanciaTotal,
          camion: camion,
          estado_ruta: estadoRuta,
          vendedor_id: dto.vendedor_id || null,
          numero_ruta: 0, // Se generará automáticamente
        };

        const ruta = await queryRunner.manager.save(RutaEntity, rutaData);

        // 4.3 Crear nodos
        if (dto.nodos?.length) {
          const nodosConDireccion = dto.nodos.map(nodo => ({
            ...nodo,
            direccion: nodo.direccion || `${nodo.latitud}, ${nodo.longitud}`,
          }));

          await this.nodosRutasService.bulkCreateNodos(
            nodosConDireccion,
            ruta,
            queryRunner.manager,
          );
        }

        savedRutas.push(ruta);
      }

      // 5. Confirmar transacción
      await queryRunner.commitTransaction();

      // 6. Retornar rutas con relaciones
      const rutas = await Promise.all(savedRutas.map((r) => this.findOne(r.id)));
      return rutas.filter((r): r is RutaEntity => r !== null);
    } catch (error) {
      console.error('Error creando rutas:', error);
      await queryRunner.rollbackTransaction();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear las rutas');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.rutaRepository.find({
      relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas'],
    });
  }

  findOne(id: string) {
    return this.rutaRepository.findOne({
      where: { id },
      relations: ['tipo_ruta', 'estado_ruta', 'camion', 'nodos_rutas', 'nodos_rutas.productos'],
    });
  }

  update(id: number) {
    return `This action updates a #${id} ruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} ruta`;
  }
}
