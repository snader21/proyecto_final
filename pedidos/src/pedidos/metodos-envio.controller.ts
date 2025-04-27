import { Controller, Get } from '@nestjs/common';
import { MetodosEnvioService } from './metodos-envio.service';

@Controller('metodos-envio')
export class MetodosEnvioController {
  constructor(private readonly metodosEnvioService: MetodosEnvioService) {}

  @Get()
  async findAll() {
    return await this.metodosEnvioService.findAll();
  }
}
