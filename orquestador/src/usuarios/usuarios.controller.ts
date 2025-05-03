import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
@RequirePermission('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('/roles')
  async obtenerRoles(): Promise<any> {
    return this.usuariosService.obtenerRoles();
  }

  @Post()
  async crearUsuario(@Body() usuario: any): Promise<any> {
    return this.usuariosService.crearUsuario(usuario);
  }

  @Get()
  async obtenerUsuarios(): Promise<any> {
    return this.usuariosService.obtenerUsuarios();
  }

  @Get(':id')
  async obtenerUsuarioPorId(@Param('id') id: string): Promise<any> {
    return this.usuariosService.obtenerUsuarioPorId(id);
  }

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string): Promise<any> {
    return this.usuariosService.eliminarUsuario(id);
  }

  @Put(':id')
  async actualizarUsuario(
    @Param('id') id: string,
    @Body() usuario: any,
  ): Promise<any> {
    return this.usuariosService.actualizarUsuario(id, usuario);
  }
}
