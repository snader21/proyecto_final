import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { VendedorEntity } from './entities/vendedor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ZonasService } from '../zonas/zonas.service';
import { UpdateVendedorDto } from './dto/update-vendedore.dto';
import { UserVendedorDto } from './dto/update-user-vendedor.dto';

@Injectable()
export class VendedoresService {
  constructor(
    @InjectRepository(VendedorEntity)
    private readonly repository: Repository<VendedorEntity>,
    private readonly zonasService: ZonasService,
  ) {}
  async create(createVendedorDto: CreateVendedorDto) {
    if (!createVendedorDto.roles.includes('Vendedor')) {
      throw new BadRequestException(
        'El usuario debe tener al menos el rol de vendedor',
      );
    }
    const zona = await this.zonasService.findOne(createVendedorDto.zonaId);
    if (!zona) {
      throw new NotFoundException('Zona no encontrada');
    }
    return this.repository.save({
      nombre: createVendedorDto.nombre,
      correo: createVendedorDto.correo,
      telefono: createVendedorDto.telefono,
      usuario_id: createVendedorDto.usuarioId,
      zona,
    });
  }

  async findAll() {
    return this.repository.find({
      relations: ['zona'],
    });
  }

  async findOne(id: string) {
    const vendedor = await this.repository.findOne({
      where: { id },
      relations: ['zona'],
    });
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    return vendedor;
  }

  async findOneByUsuarioId(usuarioId: string) {
    const vendedor = await this.repository.findOne({
      where: { usuario_id: usuarioId },
    });
    return vendedor;
  }

  async update(id: string, updateVendedorDto: UpdateVendedorDto) {
    const vendedor = await this.findOne(id);
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    const zona = updateVendedorDto.zonaId
      ? await this.zonasService.findOne(updateVendedorDto.zonaId)
      : vendedor.zona;
    if (!zona) {
      throw new NotFoundException('Zona no encontrada');
    }
    return this.repository.update(id, {
      usuario_id: updateVendedorDto.usuarioId || vendedor.usuario_id,
      nombre: updateVendedorDto.nombre || vendedor.nombre,
      correo: updateVendedorDto.correo || vendedor.correo,
      telefono: updateVendedorDto.telefono || vendedor.telefono,
      zona,
    });
  }

  async updateUserVendedor(id: string, updateUserVendedorDto: UserVendedorDto) {
    const vendedor = await this.repository.findOne({
      where: { usuario_id: id },
    });

    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    console.log('Datos recibidos para actualización:', updateUserVendedorDto);

    const updateData = {
      nombre: updateUserVendedorDto.nombre,
      correo: updateUserVendedorDto.correo,
    };

    return this.repository.update(vendedor.id, updateData);
  }

  async remove(id: string) {
    const vendedor = await this.findOne(id);
    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }
    await this.repository.delete(id);
  }
}
