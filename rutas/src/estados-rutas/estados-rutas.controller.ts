import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstadosRutasService } from './estados-rutas.service';
import { CreateEstadoRutaDto } from './dto/create-estado-ruta.dto';
import { UpdateEstadoRutaDto } from './dto/update-estado-ruta.dto';

@Controller('estados-rutas')
export class EstadosRutasController {
  constructor(private readonly estadosRutasService: EstadosRutasService) {}

  @Post()
  create(@Body() createEstadosRutaDto: CreateEstadoRutaDto) {
    return this.estadosRutasService.create(createEstadosRutaDto);
  }

  @Get()
  findAll() {
    return this.estadosRutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estadosRutasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEstadosRutaDto: UpdateEstadoRutaDto,
  ) {
    return this.estadosRutasService.update(+id, updateEstadosRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estadosRutasService.remove(+id);
  }
}
