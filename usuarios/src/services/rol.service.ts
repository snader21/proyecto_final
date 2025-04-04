import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../entities/permiso.entity';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../dto/create-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { id } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }

  async findByName(nombre: string): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { nombre } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const existingRol = await this.rolRepository.findOne({
      where: { nombre: createRolDto.nombre },
    });

    if (existingRol) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const { permisos, ...rolData } = createRolDto;
    const rol = this.rolRepository.create(rolData);

    if (permisos) {
      const permisosEntities = await Promise.all(
        permisos.map(async (id) => {
          const permiso = await this.permisoRepository.findOneBy({ id });
          if (!permiso) {
            throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
          }
          return permiso;
        }),
      );
      rol.permisos = permisosEntities;
    }

    return this.rolRepository.save(rol);
  }
}
