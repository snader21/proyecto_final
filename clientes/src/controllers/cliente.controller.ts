import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Put,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { GetClienteDto } from '../dto/get-cliente.dto';
import { Cliente } from '../entities/cliente.entity';
import { AssignVendedorDto } from 'src/dto/assign-vendedor.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  /**
   * Maneja las solicitudes POST a /clientes.
   * Crea un nuevo cliente.
   * @param createClienteDto Los datos para crear el cliente.
   * @returns Una promesa que resuelve a la entidad Cliente creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClienteDto: CreateClienteDto): Promise<Cliente> {
    return this.clienteService.create(createClienteDto);
  }

  /**
   * Maneja las solicitudes GET a /clientes.
   * Retorna todos los clientes, mapeados al DTO de salida.
   * @returns Una promesa que resuelve a un array de GetClienteDto.
   */
  @Get()
  async findAll(): Promise<GetClienteDto[]> {
    return this.clienteService.findAll();
  }

  /**
   * Maneja las solicitudes GET a /clientes/vendedor.
   * Retorna clientes filtrados por id_vendedor.
   * Si el parámetro vendedorId no se proporciona, retorna clientes sin vendedor asignado (id_vendedor es NULL).
   * Si se proporciona el string "null", también busca clientes sin vendedor asignado.
   * @param vendedorId El ID del vendedor (UUID) o el string "null".
   * @returns Una promesa que resuelve a un array de entidades Cliente.
   */
  @Get('vendedor')
  async findByVendedorId(
    @Query('vendedorId') vendedorIdParam?: string,
  ): Promise<Cliente[]> {
    let vendedorId: string | null = null;

    if (
      vendedorIdParam !== undefined &&
      vendedorIdParam !== null &&
      vendedorIdParam.toLowerCase() !== 'null'
    ) {
      vendedorId = vendedorIdParam;
    }
    return this.clienteService.findByVendedorId(vendedorId);
  }

  /**
   * Maneja las solicitudes GET a /clientes/:id.
   * Retorna un cliente específico por su ID (UUID).
   * @param id El ID del cliente (validado como UUID).
   * @returns Una promesa que resuelve a la entidad Cliente encontrada.
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Cliente> {
    return this.clienteService.findOne(id);
  }

  /**
   * Maneja las solicitudes PUT a /clientes/:id.
   * Actualiza un cliente existente por su ID (UUID).
   * @param id El ID del cliente a actualizar (validado como UUID).
   * @param updateClienteDto Los datos para actualizar el cliente.
   * @returns Una promesa que resuelve a la entidad Cliente actualizada.
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    return this.clienteService.update(id, updateClienteDto);
  }

  /**
   * Maneja las solicitudes DELETE a /clientes/:id.
   * Elimina un cliente existente por su ID (UUID).
   * @param id El ID del cliente a eliminar (validado como UUID).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.clienteService.remove(id);
  }

  /**
   * Maneja las solicitudes PUT a /clientes/:id/vendedor.
   * Asigna o desasigna un vendedor a un cliente específico.
   * @param id El ID del cliente al que se asignará/desasignará el vendedor (validado como UUID).
   * @param assignVendedorDto El DTO que contiene el id_vendedor a asignar (puede ser null).
   * @returns Una promesa que resuelve a la entidad Cliente actualizada.
   */
  @Put(':id/vendedor')
  async assignVendedor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignVendedorDto: AssignVendedorDto,
  ): Promise<Cliente> {
    // Pasar el id_vendedor del body directamente al servicio.
    // El servicio ya sabe cómo manejar el caso null.
    return this.clienteService.assignVendedorToCliente(
      id,
      assignVendedorDto.id_vendedor ?? null,
    );
  }
}
