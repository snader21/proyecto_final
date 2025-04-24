import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VisitaService } from '../services/visita.service';
import { CreateVisitaDto } from '../dtos/create-visita.dto';

@Controller('clientes/visitas')
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  /**
   * Registra una nueva visita para un cliente
   * @param createVisitaDto Los datos de la visita a registrar
   * @returns La visita registrada
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registrarVisita(@Body() createVisitaDto: CreateVisitaDto) {
    return this.visitaService.registrarVisita(createVisitaDto);
  }

  /**
   * Obtiene todas las visitas de un cliente específico
   * @param id_cliente ID del cliente
   * @returns Lista de visitas del cliente
   */
  @Get('cliente/:id_cliente')
  async obtenerVisitasCliente(
    @Param('id_cliente', ParseUUIDPipe) id_cliente: string,
  ) {
    return this.visitaService.obtenerVisitasCliente(id_cliente);
  }
}
