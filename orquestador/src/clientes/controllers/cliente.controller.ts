/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClienteService } from '../services/cliente.service';
import { CreateClienteDto } from '../dtos/create-cliente.dto';
import { UpdateClienteDto } from '../dtos/update-cliente.dto';
import { GetClienteDto } from '../dtos/get-cliente.dto';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    return this.clienteService.create(createClienteDto);
  }

  @Get()
  async findAll(): Promise<GetClienteDto[]> {
    return this.clienteService.findAll();
  }

  @Get('vendedor')
  async findByVendedorId(@Query('vendedorId') vendedorId: string | null) {
    return this.clienteService.findByVendedorId(vendedorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clienteService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.clienteService.remove(id);
  }

  @Put(':id/vendedor')
  async assignVendedorToCliente(
    @Param('id') id: string,
    @Body('id_vendedor') id_vendedor: string | null,
  ) {
    return this.clienteService.assignVendedorToCliente(id, id_vendedor);
  }
}
