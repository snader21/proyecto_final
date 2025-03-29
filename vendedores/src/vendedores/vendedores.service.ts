import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadosVendedoresService } from '../estados-vendedores/estados-vendedores.service';
import { ZonasService } from '../zonas/zonas.service';
import { UpdateVendedorDto } from './dto/update-vendedore.dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectRepository(VendedorEntity)
    private readonly repository: Repository<VendedorEntity>,
    private readonly estadosVendedoresService: EstadosVendedoresService,
    private readonly zonasService: ZonasService,
  ) {}
  async create(createVendedoreDto: CreateVendedorDto) {
    const estado = await this.estadosVendedoresService.findOne(
      createVendedoreDto.estadoId,
    );
    if (!estado) {
      throw new NotFoundException('Estado no encontrado');
    }
    const zona = await this.zonasService.findOne(createVendedoreDto.zonaId);
    if (!zona) {
      throw new NotFoundException('Zona no encontrada');
    }
    return this.repository.save({
      nombre: createVendedoreDto.nombre,
      correo: createVendedoreDto.correo,
      telefono: createVendedoreDto.telefono,
      usuario_id: createVendedoreDto.usuarioId,
      zona,
      estado,
    });
  }

  findAll() {
    return this.repository.find({
      relations: ['zona', 'estado'],
    });
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['zona', 'estado'],
    });
  }

  async update(id: number, updateVendedoreDto: UpdateVendedorDto) {
    const vendedor = await this.findOne(id);
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    const zona = updateVendedoreDto.zonaId
      ? await this.zonasService.findOne(updateVendedoreDto.zonaId)
      : vendedor.zona;
    if (!zona) {
      throw new NotFoundException('Zona no encontrada');
    }
    const estado = updateVendedoreDto.estadoId
      ? await this.estadosVendedoresService.findOne(updateVendedoreDto.estadoId)
      : vendedor.estado;
    if (!estado) {
      throw new NotFoundException('Estado no encontrado');
    }
    return this.repository.update(id, {
      usuario_id: updateVendedoreDto.usuarioId || vendedor.usuario_id,
      nombre: updateVendedoreDto.nombre || vendedor.nombre,
      correo: updateVendedoreDto.correo || vendedor.correo,
      telefono: updateVendedoreDto.telefono || vendedor.telefono,
      zona,
      estado,
    });
  }

  async remove(id: number) {
    const vendedor = await this.findOne(id);
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
  }
}
