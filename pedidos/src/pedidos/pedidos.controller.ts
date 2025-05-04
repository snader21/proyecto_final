import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { FilterPedidoDto } from './dto/filter-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(@Query('filters') filters?: string) {
    const parsedFilters: FilterPedidoDto = filters ? JSON.parse(filters) : {
      numeroPedido: undefined,
      estado: undefined,
      fechaInicio: undefined,
      fechaFin: undefined
    };
    return await this.pedidosService.findAll(parsedFilters);
  }

  @Post()
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidosService.create(createPedidoDto);
  }

  @Get('vendedor/:idVendedor')
  async findByIdVendedor(
    @Param('idVendedor') idVendedor: string,
    @Query('filters') filters?: string,
  ) {
    const parsedFilters: FilterPedidoDto = filters ? JSON.parse(filters) : {
      numeroPedido: undefined,
      estado: undefined,
      fechaInicio: undefined,
      fechaFin: undefined
    };
    return await this.pedidosService.findByIdVendedor(idVendedor, parsedFilters);
  }

  @Get('cliente/:idCliente')
  async findByIdCliente(
    @Param('idCliente') idCliente: string,
    @Query('filters') filters?: string,
  ) {
    const parsedFilters: FilterPedidoDto = filters ? JSON.parse(filters) : {
      numeroPedido: undefined,
      estado: undefined,
      fechaInicio: undefined,
      fechaFin: undefined
    };
    return await this.pedidosService.findByIdCliente(idCliente, parsedFilters);
  }

  @Get('estado-pedido')
  async findAllEstadoPedido() {
    return await this.pedidosService.findAllEstadoPedido();
  }
}
