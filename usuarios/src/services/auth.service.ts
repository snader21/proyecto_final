/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  correo: string;
  roles: string[];
  permisos: {
    id: string;
    nombre: string;
    modulo: string;
  }[];
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { correo, contrasena } = loginDto;

    // Buscar usuario por correo con sus roles y permisos
    const usuario = await this.usuarioRepository.findOne({
      where: { correo },
      relations: ['roles', 'roles.permisos'],
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      contrasena,
      usuario.contrasena_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!usuario.estado) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Obtener todos los permisos únicos del usuario a través de sus roles
    const permisosUnicos = new Map();
    usuario.roles.forEach((rol) => {
      rol.permisos.forEach((permiso) => {
        if (!permisosUnicos.has(permiso.id)) {
          permisosUnicos.set(permiso.id, {
            id: permiso.id,
            nombre: permiso.nombre,
            modulo: permiso.modulo,
          });
        }
      });
    });

    // Generar token JWT con permisos críticos
    const payload: JwtPayload = {
      sub: usuario.id,
      correo: usuario.correo,
      roles: usuario.roles.map((rol) => rol.nombre),
      permisos: Array.from(permisosUnicos.values()),
    };

    const token: string = this.jwtService.sign(payload);

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        roles: usuario.roles.map((rol) => ({
          id: rol.id,
          nombre: rol.nombre,
          descripcion: rol.descripcion,
        })),
        permisos: Array.from(permisosUnicos.values()),
      },
    };
  }
}
