import { Injectable } from '@nestjs/common';
import { CreateNodoRutaDto } from './dto/create-nodo-ruta.dto';
import { NodoRutaEntity } from './entities/nodo-ruta.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RutaEntity } from '../rutas/entities/ruta.entity';
import { NodosProductosService } from '../nodos-productos/nodos-productos.service';
import { UpdateNodoRutaDto } from './dto/update-nodo-ruta.dto';

@Injectable()
export class NodosRutasService {
  constructor(
    @InjectRepository(NodoRutaEntity)
    private readonly nodoRutaRepository: Repository<NodoRutaEntity>,
    private readonly nodosProductosService: NodosProductosService,
  ) {}

  async bulkCreateNodos(
    nodosDtos: CreateNodoRutaDto[],
    ruta: RutaEntity,
    manager: EntityManager,
  ): Promise<NodoRutaEntity[]> {
    const nodosEntities = nodosDtos.map((dto) =>
      this.nodoRutaRepository.create({
        numero_nodo_programado: dto.numeroNodoProgramado,
        latitud: dto.latitud,
        longitud: dto.longitud,
        ruta,
      }),
    );

    const savedNodos = await manager.save(NodoRutaEntity, nodosEntities);

    for (let i = 0; i < nodosDtos.length; i++) {
      const dto = nodosDtos[i];
      if (dto.productos && dto.productos.length) {
        await this.nodosProductosService.bulkCreateProductos(
          dto.productos,
          savedNodos[i],
          manager,
        );
      }
    }

    return savedNodos;
  }

  create(createNodosRutaDto: CreateNodoRutaDto) {
    return 'This action adds a new nodosRuta';
  }

  findAll() {
    return `This action returns all nodosRutas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nodosRuta`;
  }

  update(id: number, updateNodosRutaDto: UpdateNodoRutaDto) {
    return `This action updates a #${id} nodosRuta`;
  }

  remove(id: number) {
    return `This action removes a #${id} nodosRuta`;
  }
}
