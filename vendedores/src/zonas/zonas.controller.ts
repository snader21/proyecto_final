import { Controller, Get, Param } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { UUIDParamDto } from '../shared/dto/id-param.dto';
@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: UUIDParamDto) {
    return this.zonasService.findOne(params.id);
  }
}
