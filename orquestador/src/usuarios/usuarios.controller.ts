import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ModulePermissionGuard } from '../auth/guards/roles.guard';
import { RequirePermission } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, ModulePermissionGuard)
@RequirePermission('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async crearUsuario(@Body() usuario: any) {
    return this.usuariosService.crearUsuario(usuario);
  }

  @Get()
  async obtenerUsuarios() {
    return this.usuariosService.obtenerUsuarios();
  }

  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: string) {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string) {
    return this.usuariosService.eliminarUsuario(id);
  }
}
