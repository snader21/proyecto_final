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
import { CreateVisitaDto } from '../dto/create-visita.dto';
import { VisitaCliente } from '../entities/visita-cliente.entity';

@Controller('visitas')
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  /**
   * Registra una nueva visita para un cliente
   * @param createVisitaDto Los datos de la visita a registrar
   * @returns La visita registrada
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registrarVisita(@Body() createVisitaDto: CreateVisitaDto): Promise<VisitaCliente> {
    return this.visitaService.create(createVisitaDto);
  }

  /**
   * Obtiene todas las visitas de un cliente específico
   * @param id_cliente ID del cliente
   * @returns Lista de visitas del cliente
   */
  @Get('cliente/:id_cliente')
  async obtenerVisitasCliente(
    @Param('id_cliente', ParseUUIDPipe) id_cliente: string,
  ): Promise<VisitaCliente[]> {
    return this.visitaService.findByCliente(id_cliente);
  }
}
