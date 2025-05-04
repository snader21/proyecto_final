import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crearPedido(@Body() dto: any) {
    return this.pedidosService.crearPedido(dto);
  }

  @Get()
  async findAll(
    @Query('numeroPedido') numeroPedido?: string,
    @Query('estado') estado?: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.pedidosService.findAll({
      numeroPedido,
      estado,
      fechaInicio,
      fechaFin,
    });
  }

  @Get('vendedor/:idVendedor')
  async findByIdVendedor(
    @Param('idVendedor') idVendedor: string,
    @Query('numeroPedido') numeroPedido?: string,
    @Query('estado') estado?: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.pedidosService.findByIdVendedor(idVendedor, {
      numeroPedido,
      estado,
      fechaInicio,
      fechaFin,
    });
  }

  @Get('cliente/:idCliente')
  async findByIdCliente(
    @Param('idCliente') idCliente: string,
    @Query('numeroPedido') numeroPedido?: string,
    @Query('estado') estado?: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return await this.pedidosService.findByIdCliente(idCliente, {
      numeroPedido,
      estado,
      fechaInicio,
      fechaFin,
    });
  }

  @Get('estado-pedido')
  async findAllEstadoPedido() {
    return await this.pedidosService.findAllEstadoPedido();
  }
}
