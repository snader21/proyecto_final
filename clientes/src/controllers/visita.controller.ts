import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { VisitaService } from '../services/visita.service';
import { CreateVisitaDto } from '../dto/create-visita.dto';
import { VisitaCliente } from '../entities/visita-cliente.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('video'))
  async registrarVisita(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVisitaDto: CreateVisitaDto,
  ): Promise<VisitaCliente> {
    console.log(createVisitaDto);
    return this.visitaService.create(createVisitaDto, file);
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

  /**
   * Obtiene la url de un video
   * @param key ID del video
   * @returns Url del video
   */
  @Get('video/:key')
  async obtenerUrlVideo(@Param('key') key: string): Promise<any> {
    return this.visitaService.getUrl(key);
  }
}
