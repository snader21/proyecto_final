/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateClienteDto } from '../dtos/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/update-cliente.dto';
import { GetClienteDto } from '../dtos/get-cliente.dto';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { UsuarioDto } from '../../usuarios/dto/usuario.dto';
import { AxiosError } from 'axios';

interface MapboxFeature {
  center: [number, number];
  context: Array<{
    id: string;
    text: string;
  }>;
}

interface MapboxResponse {
  features: MapboxFeature[];
}

@Injectable()
export class ClienteService {
  private readonly clientesApiUrl: string;
  private readonly mapboxApiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    const apiUrl = this.configService.get<string>('URL_CLIENTES');
    const mapboxKey = this.configService.get<string>('MAPBOX_API_KEY');
    if (!apiUrl) {
      throw new Error('URL_CLIENTES environment variable is not defined');
    }
    if (!mapboxKey) {
      throw new Error('MAPBOX_API_KEY environment variable is not defined');
    }
    this.clientesApiUrl = apiUrl;
    this.mapboxApiKey = mapboxKey;
  }

  private async getGeocodingData(direccion: string) {
    try {
      const encodedAddress = encodeURIComponent(direccion);
      const { data } = await firstValueFrom(
        this.httpService.get<MapboxResponse>(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${this.mapboxApiKey}`,
        ),
      );

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const context = data.features[0].context || [];
        const pais = context.find((c) => c.id.startsWith('country'))?.text;
        const ciudad = context.find((c) => c.id.startsWith('place'))?.text;

        return {
          lat,
          lng,
          pais,
          ciudad,
        };
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos de geocodificación:', error);
      return null;
    }
  }

  async create(createClienteDto: CreateClienteDto) {
    const apiEndPoint = `${this.clientesApiUrl}/clientes`;

    let usuario: UsuarioDto | null = null;
    try {
      // Get geocoding data if address is provided
      let geocodingData;
      if (createClienteDto.direccion) {
        geocodingData = await this.getGeocodingData(createClienteDto.direccion);
        console.log(geocodingData);
      }
      const rol = await this.findClienteRol();
      usuario = (await this.usuariosService.crearUsuario({
        nombre: createClienteDto?.nombre,
        correo: createClienteDto?.correo,
        contrasena: createClienteDto?.contrasena,
        estado: 'active',
        roles: [rol],
      })) as UsuarioDto;
      const latitud = geocodingData?.lat ?? 0;
      const longitud = geocodingData?.lng ?? 0;
      console.log(latitud, longitud);
      const { data: cliente } = await firstValueFrom(
        this.httpService.post<GetClienteDto>(apiEndPoint, {
          usuarioId: usuario.id,
          nombre: createClienteDto.nombre,
          id_tipo_cliente: createClienteDto.id_tipo_cliente,
          direccion: createClienteDto.direccion,
          telefono: createClienteDto.telefono,
          documento_identidad: createClienteDto.documento_identidad,
          lat: latitud.toString(),
          lng: longitud.toString(),
          pais: geocodingData?.pais ?? createClienteDto.pais,
          ciudad: geocodingData?.ciudad ?? createClienteDto.ciudad,
        }),
      );

      return cliente;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (usuario) {
        await this.usuariosService.eliminarUsuario(usuario.id);
      }
      throw new BadRequestException(
        'Se produjo un error al crear el cliente: ' +
          axiosError?.response?.data?.message,
      );
    }
  }

  async findClienteRol() {
    const roles = await this.usuariosService.obtenerRoles();
    return roles.find((r) => r.nombre === 'Cliente').id;
  }

  async findAll(): Promise<GetClienteDto[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes`),
    );
    return data;
  }

  async findByVendedorId(vendedorId: string | null) {
    const params = vendedorId !== null ? { vendedorId: vendedorId } : {};
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes/vendedor`, {
        params: params,
      }),
    );

    return data; // 'data' contendrá el array de clientes devuelto por la API
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.clientesApiUrl}/clientes/${id}`),
    );
    return data;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const { data } = await firstValueFrom(
      this.httpService.put(
        `${this.clientesApiUrl}/clientes/${id}`,
        updateClienteDto,
      ),
    );
    return data;
  }

  async remove(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`${this.clientesApiUrl}/clientes/${id}`),
    );
    return data;
  }

  async assignVendedorToCliente(id: string, id_vendedor: string | null) {
    const { data } = await firstValueFrom(
      this.httpService.put(`${this.clientesApiUrl}/clientes/${id}/vendedor`, {
        id_vendedor,
      }),
    );
    return data;
  }
}
