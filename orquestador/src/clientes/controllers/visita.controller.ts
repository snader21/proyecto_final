/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VisitaService } from '../services/visita.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('clientes/visitas')
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  /**
   * Registra una nueva visita para un cliente
   * @param createVisitaDto Los datos de la visita a registrar
   * @returns La visita registrada
   */
  @Post()
  @UseInterceptors(FileInterceptor('video'))
  async reenviarVisita(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVisitaDto: any,
  ) {
    const formData = new FormData();
    formData.append('id_cliente', createVisitaDto.id_cliente);
    formData.append('fecha_visita', createVisitaDto.fecha_visita);
    formData.append('realizo_pedido', createVisitaDto.realizo_pedido);
    if (createVisitaDto.observaciones) {
      formData.append('observaciones', createVisitaDto.observaciones);
    }

    if (file) {
      formData.append('video', new Blob([file.buffer]), file.originalname);
    }

    return this.visitaService.registrarVisita(formData);
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

  @Get()
  async obtenerTodosLosClientesConUltimaVisita(): Promise<Array<{
    id_vendedor: string;
    clientes: Array<{
      id_cliente: string;
      id_vendedor: string;
      ultima_visita: Date | null;
      lat: number;
      lng: number;
    }>;
  }>> {
    return this.visitaService.obtenerTodosLosClientesConUltimaVisita();
  }

  @Get('video/:key')
  obtenerUrlVideo(@Param('key') key: string): Promise<any> {
    return this.visitaService.obtenerUrlVideo(key);
  }
}
