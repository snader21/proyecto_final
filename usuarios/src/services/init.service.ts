/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { Permiso, TipoRecurso } from '../entities/permiso.entity';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { EstadoUsuario } from 'src/dto/create-usuario.dto';
@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly usuarioService: UsuarioService,
  ) {}

  async onModuleInit() {
    // Crear roles
    const roles = [
      {
        nombre: 'Administrador',
        descripcion: 'Usuario con acceso total al sistema',
      },
      {
        nombre: 'Director de ventas',
        descripcion: 'Usuario con acceso a gestión de ventas',
      },
      {
        nombre: 'Vendedor',
        descripcion: 'Usuario con acceso a gestión de ventas',
      },
      {
        nombre: 'Director de compras',
        descripcion: 'Usuario con acceso a gestión de compras',
      },
      {
        nombre: 'Director de logistica',
        descripcion: 'Usuario con acceso a gestión de logística',
      },
      {
        nombre: 'Cliente',
        descripcion: 'Usuario con acceso básico al sistema',
      },
    ];

    const rolesCreados = await Promise.all(
      roles.map(async (rol) => {
        const existingRol = await this.rolRepository.findOne({
          where: { nombre: rol.nombre },
        });

        if (!existingRol) {
          return await this.rolRepository.save(rol);
        }
        return existingRol;
      }),
    );

    // Crear permisos
    const permisos = [
      {
        nombre: 'Acceso a Módulo de usuarios',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'usuarios',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de usuarios',
      },
      {
        nombre: 'Acceso a Módulo de Pedidos',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'pedidos',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de pedidos',
      },
      {
        nombre: 'Acceso a Módulo de Vendedores',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'vendedores',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de vendedores',
      },
      {
        nombre: 'Acceso a Módulo de Productos',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'productos',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de productos',
      },
      {
        nombre: 'Acceso a Módulo de Rutas',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'rutas',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de rutas',
      },
      {
        nombre: 'Acceso a Módulo de Fabricantes',
        tipoRecurso: TipoRecurso.BACKEND,
        modulo: 'fabricantes',
        descripcion:
          'Permite acceder a todas las funcionalidades del módulo de fabricantes',
      },
      // Permisos de FRONTEND
      {
        nombre: 'Acceso a Página de Usuarios',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'usuarios',
        ruta: '/usuarios',
        descripcion: 'Permite acceder a la página de gestión de usuarios',
      },
      {
        nombre: 'Acceso a Página de Productos',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'productos',
        ruta: '/productos',
        descripcion: 'Permite acceder a la página de gestión de productos',
      },
      {
        nombre: 'Acceso a Página de Fabricantes',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'fabricantes',
        ruta: '/fabricantes',
        descripcion: 'Permite acceder a la página de gestión de fabricantes',
      },
      {
        nombre: 'Acceso a Página de Vendedores',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'vendedores',
        ruta: '/vendedores',
        descripcion: 'Permite acceder a la página de gestión de vendedores',
      },
      {
        nombre: 'Acceso a Página de Reportes',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'reportes',
        ruta: '/reportes',
        descripcion: 'Permite acceder a la página de gestión de reportes',
      },
      {
        nombre: 'Acceso a Página de pedidos',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'pedidos',
        ruta: '/pedidos',
        descripcion: 'Permite acceder a la página de gestión de pedidos',
      },
      {
        nombre: 'Acceso a Página de rutas',
        tipoRecurso: TipoRecurso.FRONTEND,
        modulo: 'rutas',
        ruta: '/rutas',
        descripcion: 'Permite acceder a la página de gestión de rutas',
      },
    ];

    const permisosCreados = await Promise.all(
      permisos.map(async (permiso) => {
        const existingPermiso = await this.permisoRepository.findOne({
          where: { nombre: permiso.nombre },
        });

        if (!existingPermiso) {
          return await this.permisoRepository.save(permiso);
        }

        // Actualizar el permiso existente con los nuevos campos
        Object.assign(existingPermiso, permiso);
        return await this.permisoRepository.save(existingPermiso);
      }),
    );

    // Asignar permisos a roles
    for (const rol of rolesCreados) {
      const rolActualizado = await this.rolRepository.findOne({
        where: { id: rol.id },
        relations: ['permisos'],
      });

      if (!rolActualizado) continue;

      switch (rolActualizado.nombre) {
        case 'Administrador':
          rolActualizado.permisos = permisosCreados;
          break;
        case 'Vendedor':
          rolActualizado.permisos = permisosCreados.filter(
            (p) => p.modulo === 'pedidos' || p.modulo === 'productos',
          );
          break;
        case 'Director de ventas':
          rolActualizado.permisos = permisosCreados.filter(
            (p) =>
              (p.modulo === 'pedidos' ||
                p.modulo === 'productos' ||
                p.modulo === 'vendedores') &&
              (p.tipoRecurso === TipoRecurso.BACKEND ||
                p.tipoRecurso === TipoRecurso.FRONTEND),
          );
          break;
        case 'Director de compras':
          rolActualizado.permisos = permisosCreados.filter(
            (p) =>
              (p.modulo === 'productos' || p.modulo === 'fabricantes') &&
              (p.tipoRecurso === TipoRecurso.BACKEND ||
                p.tipoRecurso === TipoRecurso.FRONTEND),
          );
          break;
        case 'Director de logistica':
          rolActualizado.permisos = permisosCreados.filter(
            (p) =>
              (p.modulo === 'rutas' || p.modulo === 'pedidos') &&
              (p.tipoRecurso === TipoRecurso.BACKEND ||
                p.tipoRecurso === TipoRecurso.FRONTEND),
          );
          break;
        case 'Cliente':
          rolActualizado.permisos = []; // El cliente no tiene permisos específicos
          break;
      }
      await this.rolRepository.save(rolActualizado);
    }

    const rolesAdministrador = rolesCreados.find(
      (r) => r.nombre === 'Administrador',
    );

    try {
      await this.usuarioService.create({
        nombre: 'Administrador',
        correo: 'admin@example.com',
        contrasena: 'admin123',
        estado: EstadoUsuario.ACTIVE,
        roles: [rolesAdministrador?.id || ''],
      });
    } catch (error) {
      console.error('Error al crear el usuario administrador', error);
    }
  }
}
