import { Controller, Get, Param } from '@nestjs/common';
import { TipoClienteService } from '../services/tipo-cliente.service';
import { GetTipoClienteDto } from '../dtos/get-tipo-cliente.dto';

@Controller('tipos-cliente')
export class TipoClienteController {
  constructor(private readonly tipoClienteService: TipoClienteService) {}

  @Get()
  async findAll(): Promise<GetTipoClienteDto[]> {
    return this.tipoClienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetTipoClienteDto> {
    return this.tipoClienteService.findOne(id);
  }
}
