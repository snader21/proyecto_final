import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRutaDto } from './dto/create-ruta.dto';
import { UpdateRutaDto } from './dto/update-ruta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RutaEntity } from './entities/ruta.entity';
import { DataSource, Repository } from 'typeorm';
import { NodosRutasService } from 'src/nodos-rutas/nodos-rutas.service';
import { TiposRutasService } from 'src/tipos-rutas/tipos-rutas.service';
import { EstadosRutasService } from 'src/estados-rutas/estados-rutas.service';
import { CamionesService } from 'src/camiones/camiones.service';
import { TipoRutaEntity } from 'src/tipos-rutas/entities/tipo-ruta.entity';
import { EstadoRutaEntity } from 'src/estados-rutas/entities/estado-ruta.entity';

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

  async create(createRutaDto: CreateRutaDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const camion = (await this.camionesService.findAll()).at(-1);

    const tipoRuta = (await this.tiposRutasService.findAll())?.find(
      (tipoRuta: TipoRutaEntity) => tipoRuta.tipo_ruta === 'Entrega de pedido',
    );

    const estadoRuta = (await this.estadosRutasService.findAll())?.find(
      (estadoRuta: EstadoRutaEntity) => estadoRuta.estado_ruta === 'Programada',
    );

    try {
      const ruta = this.rutaRepository.create({
        fecha: createRutaDto.fecha,
        tipo_ruta: tipoRuta,
        duracion_estimada: createRutaDto.duracionEstimada,
        distancia_total: createRutaDto.distanciaTotal,
        camion,
        estado_ruta: estadoRuta,
      });

      const savedRuta = await queryRunner.manager.save(RutaEntity, ruta);

      if (createRutaDto.nodos?.length) {
        await this.nodosRutasService.bulkCreateNodos(
          createRutaDto.nodos,
          savedRuta,
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      return this.findOne(savedRuta.id);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create route');
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.rutaRepository.find({
      relations: ['nodos_rutas', 'nodos_rutas.productos'],
    });
  }

  findOne(id: number) {
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
