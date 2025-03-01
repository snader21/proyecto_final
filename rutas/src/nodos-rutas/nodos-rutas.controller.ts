import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NodosRutasService } from './nodos-rutas.service';
import { CreateNodoRutaDto } from './dto/create-nodo-ruta.dto';
import { UpdateNodoRutaDto } from './dto/update-nodo-ruta.dto';

@Controller('nodos-rutas')
export class NodosRutasController {
  constructor(private readonly nodosRutasService: NodosRutasService) {}

  @Post()
  create(@Body() createNodosRutaDto: CreateNodoRutaDto) {
    return this.nodosRutasService.create(createNodosRutaDto);
  }

  @Get()
  findAll() {
    return this.nodosRutasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nodosRutasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNodosRutaDto: UpdateNodoRutaDto,
  ) {
    return this.nodosRutasService.update(+id, updateNodosRutaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nodosRutasService.remove(+id);
  }
}
