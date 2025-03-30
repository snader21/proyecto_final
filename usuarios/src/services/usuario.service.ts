import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Rol } from '../entities/rol.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo: createUsuarioDto.correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDto.contrasena, 10);

    const { contrasena, roles, ...userData } = createUsuarioDto;
    const usuario = this.usuarioRepository.create({
      ...userData,
      contrasena_hash: hashedPassword,
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

    return this.usuarioRepository.save(usuario);
  }
}
