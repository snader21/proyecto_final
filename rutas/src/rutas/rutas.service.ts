import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { DataSource, Repository } from 'typeorm';
import { NodosRutasService } from '../nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from '../tipos-rutas/tipos-rutas.service';
import { EstadosRutasService } from '../estados-rutas/estados-rutas.service';
import { CamionesService } from '../camiones/camiones.service';
import { TipoRutaEntity } from '../tipos-rutas/entities/tipo-ruta.entity';
import { EstadoRutaEntity } from '../estados-rutas/entities/estado-ruta.entity';
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

  update(id: number, updateRutaDto: UpdateRutaDto) {
    return `This action updates a #${id} ruta`;
  }

  remove(id: number) {
    return `This action removes a #${id} ruta`;
  }
}
