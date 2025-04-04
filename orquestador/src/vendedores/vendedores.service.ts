import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendedorDto } from './dto/create-vendedor.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { VendedorDto } from './dto/vendedor.dto';
import { UsuarioDto } from '../usuarios/dto/usuario.dto';
@Injectable()
export class VendedoresService {
  private readonly apiVendedores =
    this.configService.get<string>('URL_VENDEDORES');
  constructor(
    private readonly httpService: HttpService,
    private readonly usuariosService: UsuariosService,
    private readonly configService: ConfigService,
  ) {}

  async crearVendedor(createVendedorDto: CreateVendedorDto) {
    const apiEndPoint = `${this.apiVendedores}/vendedores`;

    let usuario: UsuarioDto | null = null;
    try {
      usuario = (await this.usuariosService.crearUsuario({
        nombre: createVendedorDto?.nombre,
        correo: createVendedorDto?.correo,
        contrasena: createVendedorDto?.contrasena,
        estado: createVendedorDto?.estado,
        roles: createVendedorDto?.roles,
      })) as UsuarioDto;

      const { data: vendedor } = await firstValueFrom(
        this.httpService.post<VendedorDto>(apiEndPoint, {
          usuarioId: usuario.id,
          ...createVendedorDto,
          roles: usuario?.roles?.map((rol) => rol.nombre),
        }),
      );

      return vendedor;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (usuario) {
        await this.usuariosService.eliminarUsuario(usuario.id);
      }
      throw new BadRequestException(
        'Se produjo un error al crear el vendedor: ' +
          axiosError?.response?.data?.message,
      );
    }
  }

  async findAll() {
    const apiEndPoint = `${this.apiVendedores}/vendedores`;
    const { data: vendedores } = await firstValueFrom(
      this.httpService.get<VendedorDto[]>(apiEndPoint),
    );
    return vendedores;
  }

  async findOne(id: string) {
    const apiEndPoint = `${this.apiVendedores}/vendedores/${id}`;
    try {
      const { data: vendedor } = await firstValueFrom(
        this.httpService.get<VendedorDto>(apiEndPoint),
      );
      return vendedor;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError?.response?.status === 404) {
        throw new NotFoundException(axiosError?.response?.data?.message);
      }
      throw new BadRequestException(axiosError?.response?.data?.message);
    }
  }

  async remove(id: string) {
    const apiEndPoint = `${this.apiVendedores}/vendedores/${id}`;
    try {
      const vendedor = await this.findOne(id);
      await this.usuariosService.eliminarUsuario(vendedor.usuario_id);
      await firstValueFrom(this.httpService.delete<VendedorDto>(apiEndPoint));
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      const axiosError = error as AxiosError<{ message: string }>;
      throw new BadRequestException(axiosError?.response?.data?.message);
    }
  }
}
