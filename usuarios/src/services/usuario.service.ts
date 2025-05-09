import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto, EstadoUsuario } from '../dto/create-usuario.dto';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from 'src/dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async remove(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.usuarioRepository.remove(usuario);
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo: createUsuarioDto.correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    const { contrasena, roles, estado, ...userData } = createUsuarioDto;
    const usuario = this.usuarioRepository.create({
      ...userData,
      contrasena_hash: hashedPassword,
      estado: estado === EstadoUsuario.ACTIVE,
    });

    if (roles && roles.length > 0) {
      const rolesEntities = await Promise.all(
        roles.map(async (rolId) => {
          const rol = await this.rolRepository.findOneBy({ id: rolId });
          if (!rol) {
            throw new NotFoundException(`El rol con id: ${rolId} no existe`);
          }
          return rol;
        }),
      );
      usuario.roles = rolesEntities;
    }

    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    const usuarioActualizado = (await this.usuarioRepository.findOne({
      where: { id: usuarioGuardado.id },
      relations: ['roles'],
    })) as Usuario;
    return usuarioActualizado;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUsuarioDto.nombre) {
      usuario.nombre = updateUsuarioDto.nombre;
    }
    if (updateUsuarioDto.correo) {
      usuario.correo = updateUsuarioDto.correo;
    }
    if (updateUsuarioDto.estado) {
      usuario.estado = updateUsuarioDto.estado === EstadoUsuario.ACTIVE;
    }
    const usuarioGuardado = await this.usuarioRepository.save(usuario);

    const usuarioActualizado = (await this.usuarioRepository.findOne({
      where: { id: usuarioGuardado.id },
      relations: ['roles'],
    })) as Usuario;
    return usuarioActualizado;
  }
}
