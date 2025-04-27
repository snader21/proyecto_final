import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll() {
    return await this.pedidosService.findAll();
  }

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidosService.create(createPedidoDto);
  }

  @Get(':idVendedor')
  async findByIdVendedor(@Param('idVendedor') idVendedor: string) {
    return await this.pedidosService.findByIdVendedor(idVendedor);
  }

}
