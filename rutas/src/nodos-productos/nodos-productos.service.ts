import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NodoProductoEntity } from './entities/nodo-producto.entity';
import { CreateNodoProductoDto } from './dto/create-nodo-producto.dto'; // Ensure this DTO is defined
import { NodoRutaEntity } from '../nodos-rutas/entities/nodo-ruta.entity';
import { UpdateNodoProductoDto } from './dto/update-nodo-producto.dto';

@Injectable()
export class NodosProductosService {
  constructor(
    @InjectRepository(NodoProductoEntity)
    private readonly nodoProductoRepository: Repository<NodoProductoEntity>,
  ) {}

  async bulkCreateProductos(
    productosDtos: CreateNodoProductoDto[],
    nodoRuta: NodoRutaEntity,
    manager: EntityManager,
  ): Promise<NodoProductoEntity[]> {
    const productosEntities = productosDtos.map((dto) => {
      return this.nodoProductoRepository.create({
        producto_id: dto.productoId,
        pedido_id: dto.pedidoId,
        nodo_ruta: nodoRuta,
      });
    });

    return await manager.save(NodoProductoEntity, productosEntities);
  }
  create(createNodoProductoDto: CreateNodoProductoDto) {
    return 'This action adds a new nodoProducto';
  }

  findAll() {
    return `This action returns all nodoProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nodoProducto`;
  }

  update(id: number, updateNodoProductoDto: UpdateNodoProductoDto) {
    return `This action updates a #${id} nodoProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} nodoProducto`;
  }
}
