import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'; // Importa ParseIntPipe
import { TipoClienteService } from '../services/tipo-cliente.service'; // Importa el servicio correcto
import { TipoCliente } from '../entities/tipo-cliente.entity.ts'; // Importa la entidad si necesitas tipado de retorno (opcional)

@Controller('tipos-cliente')
export class TipoClienteController {
  constructor(private readonly tipoClienteService: TipoClienteService) {}

  /**
   * Maneja las solicitudes GET a la ruta base (/tipos-cliente).
   * Retorna todos los tipos de cliente.
   */
  @Get()
  findAll(): Promise<TipoCliente[]> {
    return this.tipoClienteService.findAll();
  }

  /**
   * Maneja las solicitudes GET a /tipos-cliente/:id.
   * Retorna un tipo de cliente específico por su ID.
   * @param id El ID del tipo de cliente (se parseará a número).
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string): Promise<TipoCliente> {
    return this.tipoClienteService.findOne(id);
  }
}
