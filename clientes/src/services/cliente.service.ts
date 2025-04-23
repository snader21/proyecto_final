import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { TipoCliente } from '../entities/tipo-cliente.entity.ts';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { GetClienteDto } from '../dto/get-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(TipoCliente)
    private readonly tipoClienteRepository: Repository<TipoCliente>,
  ) {}

  /**
   * Busca y retorna todos los clientes, incluyendo información de su tipo de cliente.
   * @returns Una promesa que resuelve a un array de GetClienteDto.
   */
  async findAll(): Promise<GetClienteDto[]> {
    const clientes = await this.clienteRepository.find({
      relations: ['tipoCliente'],
    });
    const clientesDto: GetClienteDto[] = clientes.map((cliente) => ({
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      pais: cliente.pais,
      ciudad: cliente.ciudad,
      documento_identidad: cliente.documento_identidad,
      lat: cliente.lat,
      lng: cliente.lng,
      id_tipo_cliente: cliente.tipoCliente?.id_tipo_cliente,
      tipo_cliente_nombre: cliente.tipoCliente?.tipo_cliente,
    }));

    return clientesDto;
  }

  /**
   * Busca y retorna un cliente por su ID.
   * @param id El ID del cliente a buscar.
   * @returns Una promesa que resuelve a la entidad Cliente encontrada.
   * Lanza NotFoundException si el cliente no existe.
   */
  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: id },
      relations: ['tipoCliente'],
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  /**
   * Crea un nuevo cliente.
   * @param createClienteDto Los datos para crear el cliente.
   * @returns Una promesa que resuelve a la entidad Cliente creada.
   * Lanza ConflictException si ya existe un cliente con el mismo nombre (o documento_identidad si aplicara).
   * Lanza NotFoundException si el tipo de cliente especificado no existe.
   */
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existingClienteByName = await this.clienteRepository.findOne({
      where: { nombre: createClienteDto.nombre },
    });
    if (existingClienteByName) {
      throw new ConflictException(
        `El nombre del cliente "${createClienteDto.nombre}" ya está registrado`,
      );
    }
    const existingClienteByIdentity = await this.clienteRepository.findOne({
      where: { documento_identidad: createClienteDto.documento_identidad },
    });
    if (existingClienteByIdentity) {
      throw new ConflictException(
        `El documento de identidad "${createClienteDto.documento_identidad}" ya está registrado`,
      );
    }
    const existingTipoCliente = await this.tipoClienteRepository.findOne({
      where: { id_tipo_cliente: createClienteDto.id_tipo_cliente },
    });

    if (!existingTipoCliente) {
      throw new BadRequestException(
        `El tipo de cliente con ID ${createClienteDto.id_tipo_cliente} no está registrado`,
      );
    }
    const cliente = this.clienteRepository.create(createClienteDto);
    return this.clienteRepository.save(cliente);
  }

  /**
   * Actualiza un cliente existente.
   * @param id El ID del cliente a actualizar.
   * @param updateClienteDto Los datos para actualizar el cliente.
   * @returns Una promesa que resuelve a la entidad Cliente actualizada.
   * Lanza NotFoundException si el cliente no existe.
   * Lanza BadRequestException si el nuevo tipo de cliente especificado no existe.
   */
  async update(
    id: string,
    updateClienteDto: UpdateClienteDto,
  ): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: id },
    });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    if (updateClienteDto.id_tipo_cliente !== undefined) {
      const existingTipoCliente = await this.tipoClienteRepository.findOne({
        where: { id_tipo_cliente: updateClienteDto.id_tipo_cliente },
      });
      if (!existingTipoCliente) {
        throw new BadRequestException(
          `El tipo de cliente con ID ${updateClienteDto.id_tipo_cliente} no está registrado`,
        );
      }
    }
    const updatedCliente = this.clienteRepository.merge(
      cliente,
      updateClienteDto,
    );
    return this.clienteRepository.save(updatedCliente);
  }

  /**
   * Elimina un cliente por su ID.
   * @param id El ID del cliente a eliminar.
   * Lanza NotFoundException si el cliente no existe.
   */
  async remove(id: string): Promise<void> {
    const result = await this.clienteRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }
}
